from enum import Enum

from kafka import KafkaConsumer
from kafka import KafkaProducer
import time
import json
import socket
import uuid
import argparse
import sys
import traceback
import psutil
from multiprocessing import Process

from ckscada.server.src.ckagentclient import Client
from ckscada.server.src.ckcommon import log, genericMessage, Logger, COMPRESSION_TYPE
from ckscada.server.src.ckagentsimulation import Simulation

WATCHDOG_TIMEOUT = 10
AGENT_CONSUMER_PROCESS = 'waitForMessages'

class ErrorCodes(Enum):
    SUCCESS: int = 0
    FAIL: int = 1

class Agent():
    """
    ckAgent Class Used to monitor the main consumer task

    cmdLineArguments : dict
        This includes an configuration within the json config file

    """

    def __init__(self, cmdLineArguments):
        self.cmdLineArguments = cmdLineArguments

        #Dictionary to hold ckSCADA component processes for this server.
        #The name of the process being the key and the value is the Process handler.
        #Except for the Agent consumer process 'waitForMessages', all components
        #should handle thier own redundancy
        self.processes = {}
        self.brokerArray = []
        self.producer = None
        self.logger = None
        self.admin_topic = '_admin'
        self.hostname = socket.gethostname()
        self.group_id = self.hostname + "-" + "agent" + "-" + str(uuid.uuid4())
        self.loop()

    def loop(self):
        """ Main Agent Loop used to monitor the Agent Consumer Process """
        while(True):
            if AGENT_CONSUMER_PROCESS in self.processes:
                consumerProcess = self.processes[AGENT_CONSUMER_PROCESS]['process']
                if consumerProcess.is_alive() != True:
                    self.logger.log("Main agent process has stopped. Restarting")
                    consumerProcess.terminate()
                    self.processes.pop(AGENT_CONSUMER_PROCESS)
                    self.startAgentConsumer()
                    self.logger.log("Main agent process has restarted on " + self.hostname)
                self.monitor()
            else:
                self.config = self.readConfigFile(self.cmdLineArguments)
                self.brokerArray = self.convertBrokerArrayToList(self.config)
                self.logger = Logger(self.brokerArray, self.group_id)
                self.logger.log("Starting ckSCADA Agent on  " + self.hostname + " Using group id:- " + self.group_id)
                self.startAgentConsumer()
                self.logger.log("Main agent process started on  " + self.hostname)
                self.producer = KafkaProducer(bootstrap_servers=self.brokerArray,
                                              compression_type="gzip",
                                              buffer_memory=100000000,
                                              acks=0,
                                              linger_ms=WATCHDOG_TIMEOUT,
                                              batch_size=1000000)
            time.sleep(WATCHDOG_TIMEOUT)


    def monitor(self):
        """
        Monitors the localhost's cpu/ram/io usage and sends it out on the Kafka topic
        _monitor.<hostname>

        """
        tags = {}
        tags["cpu"] = psutil.cpu_percent()
        mem = psutil.virtual_memory()
        tags["mem_total"] = mem[0]
        tags["mem_available"] = mem[1]
        tags["mem_percent"] = mem[2]
        tags["mem_used"] = mem[3]
        tags["mem_free"] = mem[4]
        tags["mem_active"] = mem[5]
        tags["mem_inactive"] = mem[6]
        tags["mem_buffers"] = mem[7]
        tags["mem_cached"] = mem[8]
        tags["mem_shared"] = mem[9]
        tags["mem_slab"] = mem[10]
        cputimes = psutil.cpu_times()
        tags["cpu_user"] = cputimes[0]
        tags["cpu_nice"] = cputimes[1]
        tags["cpu_system"] = cputimes[2]
        tags["cpu_idle"] = cputimes[3]
        tags["cpu_iowait"] = cputimes[4]
        tags["cpu_irq"] = cputimes[5]
        tags["cpu_softirq"] = cputimes[6]
        tags["cpu_steal"] = cputimes[7]
        tags["cpu_guest"] = cputimes[8]
        tags["cpu_guest_nice"] = cputimes[9]
        loadavg = psutil.getloadavg()
        tags["load_avg_1min"] = loadavg[0]
        tags["load_avg_5min"] = loadavg[1]
        tags["load_avg_15min"] = loadavg[2]
        diskusage = psutil.disk_usage('/')
        tags["diskusage_total"] = diskusage[0]
        tags["diskusage_used"] = diskusage[1]
        tags["diskusage_free"] = diskusage[2]
        tags["diskusage_percent"] = diskusage[3]

        message = { 'name': self.hostname,
                    'type': "agent",
                    'tags': tags,
                    'replication': 2,
                    'scantime': WATCHDOG_TIMEOUT
                    }
        self.producer.send("_monitor." + self.hostname , genericMessage("update", self.hostname, message, self.hostname, 2))


    def readConfigFile(self, args):
        """
        Reads the config file specified by the parsed arguments

        args : dict
            An argparse returned dict which includes the configfile to be used for the
            project.

        """
        try:
            configFile = open(args.configfile)
            return json.load(configFile)
        except FileNotFoundError:
            log(f"Unable to load config file {args.configfile}")
            exit(ErrorCodes.FAIL)


    def startAgentConsumer(self):
        """ Starts the main Agent consumer process """
        p = AgentConsumer(self.brokerArray, self.group_id)
        self.processes[AGENT_CONSUMER_PROCESS] = { 'process': p, 'type': AGENT_CONSUMER_PROCESS }
        p.start()

    def convertBrokerArrayToList(self, data):
        """
        Converts the broker array from a dict to a list

        data : dict
            Config Dictionary from config file. It must include the broker element
            with the host and port settings.

        """
        brokerArray = []
        for broker in data['brokers']:
            brokerArray.append(broker['host'] + ":" + str(broker['port']))
        return brokerArray

class AgentConsumer(Process):
    """
    This is responsible for creating and deleting individual ckSCADA components.
    It responds to requests on the '_admin' Kafka topic such as 'config', 'add'
    and 'del'

    brokerArray : list
        List of Kafka brokers used to bootstrap the Kafka cluster

    group_id : str
        Identifier for this component. Used to identify this component when
        connecting to Kafka.

    """

    def __init__(self, brokerArray, group_id):
        self.devices = { "simulation": Simulation, "client": Client}
        self.brokerArray = brokerArray
        self.processes = {}
        self.hostname = socket.gethostname()
        self.group_id = group_id
        self.admin_topic = '_admin'
        super().__init__()

    def run(self):
        """ Process run function """
        try:
            self.logger = Logger(self.brokerArray, self.group_id)
            self.producer = KafkaProducer(bootstrap_servers=self.brokerArray,
                              compression_type=COMPRESSION_TYPE,
                              acks=1,
                              linger_ms=1000,
                              batch_size=1000000)
            self.consumer = KafkaConsumer(self.admin_topic,
                              group_id=self.group_id,
                              bootstrap_servers=self.brokerArray,
                              value_deserializer=lambda m: json.loads(m.decode('utf-8')))
            self.waitForMessages()
        except Exception as e:
            log(e)
            log(traceback.print_tb(sys.exc_info()[2]))
            self.logger.log('Error: {}'.format(sys.exc_info()))

    def stop(self):
        self.kill_received = True

    def getDeviceConfig(self, name):
        """
        Get Dictionary of running ckSCADA components

        Send the dictionary to Kafka, including the process name and component type
        """
        message = {}
        try:
            for p in self.processes:
                if self.processes[p]['type'] != 'client':
                    message[p] = type(self.processes[p]['process']).__name__
            self.producer.send(self.admin_topic, genericMessage("device-config", self.group_id, message, name))
        except Exception as e:
            self.logger.log("Failed to send config update on " + self.hostname +
                            ". Using topic " + self.admin_topic +
                            " with message " + str(message))
            self.logger(e)

    def getClientConfig(self, name):
        """
        Get Dictionary of running ckSCADA components

        Send the dictionary to Kafka, including the process name and component type
        """
        message = {}
        try:
            for p in self.processes:
                if self.processes[p]['type'] == 'client':
                    message[p] = type(self.processes[p]['process']).__name__
            self.producer.send(self.admin_topic, genericMessage("client-config", self.group_id, message, name))
        except Exception as e:
            self.logger.log("Failed to send config update on " + self.hostname +
                            ". Using topic " + self.admin_topic +
                            " with message " + str(message))
            self.logger(e)

    def waitForMessages(self):
        """
        Main Consumer Loop

        It will stay in this loop indefinetly responding to cmd requests. The
        following command requests have been implemented

        -   add - Starts a new device the following values should exist in the message value.

            -   name
                    The name of the new device. This needs to be unique or
                    a new task won't be created.
            -   type
                    The type of device to create. These are specified in
                    the devices dict and include:- 'simulation, 'client'.
            -   scantime
                    This is used as the primary cycle time of the device. If it
                    is report by exception then this value is used when responding
                    to admin cmds, and to set the rate of the keep-alive messages.

        -   del - Removes and Termintaes the component manually.

            -   name
                    The name of the process to terminate.

        -   get - Get a list of components and send it out. No specific parameters need to be set.

        """
        self.logger.log("Agent consumer waiting for message " + self.hostname)
        for message in self.consumer:
            if message.value['handler'] == 'device':
                if message.value['cmd'] == 'add':
                    if not message.value['name'] in self.processes:
                        p = Process(target=self.devices[message.value['message']['type']], args=(
                            self.brokerArray,
                            message.value['name'],
                            message.value['message'],
                            message.value['replication'],
                            message.value['message']['scantime']))
                        self.logger.log("Device " + message.value['name'] + " starting on " + self.hostname)
                        self.processes[message.value['name']] =  { 'process': p, 'type': message.value['message']['type']}
                        p.start()
                    else:
                        self.logger.log("Device " + message.value['name'] + " on " + self.hostname + " is already running, not starting again")
                if message.value['cmd'] == 'del':
                    if message.value['name'] in self.processes:
                        self.processes[message.value['name']]['process'].terminate()
                        self.processes.pop(message.value['name'])
                        self.logger.log("Device " + message.value['name'] + " has been manually removed")
                    else:
                        self.logger.log("Device " + message.value['name'] + " isn't available to delete")
            if message.value['cmd'] == 'get-devices':
                self.logger.log("Recieved Agent Config Request on " + self.hostname)
                self.getDeviceConfig(message.value['name'])
            if message.value['cmd'] == 'get-clients':
                self.logger.log("Recieved Agent Config Request on " + self.hostname)
                self.getClientConfig(message.value['name'])

def parseCommandLineArguments():
    """Any command line arguments will be returned as a dictionary """
    parser = argparse.ArgumentParser(description='ckSCADA Agent.')
    parser.add_argument('--configfile',
                        default='config.json',
                        help='config file to use (default: config.json)')
    return parser.parse_args()

def main():
    log("Starting te ckSCADA server")
    log("All messages will be logged to the Kafka topic '_logging'")
    args = parseCommandLineArguments()
    agent = Agent(args)

if __name__ == '__main__':
    main()
