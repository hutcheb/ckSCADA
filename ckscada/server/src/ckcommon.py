import time
from datetime import datetime
import json
import argparse
from kafka import KafkaProducer

COMPRESSION_TYPE='gzip'

class Logger():
    """
    Kafka Logger, sends out a string to a topic with related header

    brokerArray : list
        This is an array of brokers and ports used to connect to the Kafka
        cluster. Both IP addresses and hostname can be used.

        e.g. [ '192.168.1.100:9092', 'ck-1:9092' ]

    header : str
        Deafult header to attach to the message being sent out. This can be used
        to filter logs yet won't show up as part of the message.
    """

    LOG_TOPIC = '_logging'

    def __init__(self, brokerArray, header):
        self.producer = KafkaProducer(bootstrap_servers=brokerArray,
                                      compression_type=COMPRESSION_TYPE,
                                      acks=0,
                                      linger_ms=1000,
                                      batch_size=1000000)
        self.header = self.formatHeader(header)

    def log(self, message, header=""):
        """
        Used to send a log message.

        message : str
            Message to send. The time is prepended to this message before
            sending.

        header="" : str
            The header to attach to the message. This can be used to filter logs
            but doesn't show within the message text. This overrides the class
            header variable.

        """
        if header == "":
            header = self.header
        else:
            header = self.formatHeader(header)

        #%a - Short Day name e.g. Thu, %d - Day # of the Month, %b - Short Month Name e.g. Jun
        #currentTime = time.strftime(("%a, %d %b %Y %H:%M:%S.%mmm"), time.localtime())
        currentTime = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        logString = currentTime + " :- " + str(message)
        self.producer.send(Logger.LOG_TOPIC, bytearray(logString,'utf-8'), headers=header)

    def formatHeader(self, header):
        """
        Formats the header string

        It converts it to a bytes array. It is then placed within a tuple with
        the first value the key the second value is header bytes array.
        This is then place within a list.

        header="" : str
            The header to attach to the message. This can be used to filter logs
            but doesn't show within the message text. This overrides the class
            header variable.

        """
        return [ ('logging_groups', bytes(header,'utf-8')) ]

def log(s):
    print(str(time.time()) + ":- " + str(s))

def serializer(message):
    """
    Serializer used on outgoing dictionary to Kafka.

    This converts the outgoing dictionary message to a json bytearray with utf-8
    format. This can then be sent to the topic.

    message : dict
        The message to be sent.
    """
    return bytearray(json.dumps(message),'utf-8')

def genericMessage(cmd, name, message, handler="", replication=1):
    """
    ckSCADA uses a standard json messaging format between all of its components.

    Using a dict in python converts nicely to json via the json package.

    cmd : str
        Command to be sent. This is dependant on the recieving component. Common
        commands are 'add', 'del', 'keep-alive', 'die-reset', 'config', 'tag-update'

    name : str
        name is used to identify the sender. It is usually the senders class name.

    message  : dict
        The message to be sent. This includes command specific information but
        generally includes a name and value.

    handler : string
        This identifies the receiving component. If it is an empty string then
        it is a broadcast target which expects multiple components to respond
        e.g. with 'config' messages all agents will respond.

    replication : int
        This is used command specific, an example is when adding devices. This
        specifies how many devices are enabled at once. If there isn't enough
        device instances then a new one comes online automatically.
    """
    m = { 'cmd': cmd,
    'name' : name,
    'message': message,
    'handler' : handler,
    'replication': replication
    }
    return serializer(m)
