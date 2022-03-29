import flask
from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka import KafkaAdminClient
from kafka import TopicPartition
from multiprocessing import Process, Array
import re
import time
import json
import argparse
import socket
import uuid
from ckadmincommon import log

DEFAULT_TIMEOUT_S = 15
DEFAULT_CLEANUP_TIME = 3
admin_devices_topic = '_admin.devices'
admin_topic = '_admin'
group_id_suffix = socket.gethostname()
name = "webapi"
tagDatabase = []
lastUpdate = 1
FLASK_DEBUG = True
FLASK_PORT = 4954

def genericMessage(cmd, n, message, handler=""):
    m = { 'cmd': cmd,
    'name' : n,
    'handler' : handler,
    'message': message,
    'replication': 1
    }
    return serializer(m)

def serializer(message):
    return bytearray(json.dumps(message),'utf-8')

def getAgentConfig(brokerArray, producer, consumer):
    deviceList = []
    message = {}

    tp2 = TopicPartition(admin_topic, 0)
    consumer.assign([tp2])
    consumer.seek_to_end()

    producer.send(admin_topic, genericMessage("get-devices", name, message))

    agentConfig = False
    tic = time.time()

    while (agentConfig == False) and (time.time() < (DEFAULT_TIMEOUT_S + tic)):
        messages = consumer.poll()
        if tp2 in messages:
            message = messages[tp2][0]
            m = json.loads(message.value)
            log("Recieved Message")
            log(str(m))
            if m['cmd'] == 'device-config':
                agentConfig = True
                log("Recieved Message From ckAgent")
                for p in m['message']:
                    deviceList.append(p)

    if (time.time() > (DEFAULT_TIMEOUT_S + tic)):
        log("Timed out on config request")

    return(deviceList)

def getClientConfig(brokerArray, producer, consumer):
    deviceList = []
    message = {}

    tp2 = TopicPartition(admin_topic, 0)
    consumer.assign([tp2])
    consumer.seek_to_end()

    producer.send(admin_topic, genericMessage("get-clients", name, message))

    agentConfig = False
    tic = time.time()

    while (agentConfig == False) and (time.time() < (DEFAULT_TIMEOUT_S + tic)):
        messages = consumer.poll()
        if tp2 in messages:
            message = messages[tp2][0]
            m = json.loads(message.value)
            log("Recieved Message")
            log(str(m))
            if m['cmd'] == 'client-config':
                agentConfig = True
                log("Recieved Message From ckAgent")
                for p in m['message']:
                    deviceList.append(p)

    if (time.time() > (DEFAULT_TIMEOUT_S + tic)):
        log("Timed out on config request")

    return(deviceList)


def updateConfig(brokerArray, producer, consumer):
        #producer = KafkaProducer(bootstrap_servers=brokerArray, acks=0, linger_ms=1000, batch_size=1000000)
        #consumer = KafkaConsumer(bootstrap_servers=brokerArray,
        #                                  max_poll_interval_ms=1000,
        #                                  group_id=group_id_suffix + "-" + name,
        #                                  auto_commit_interval_ms=500 )
        tic = time.time()
        log("Starting Config Update")
        deviceList = getAgentConfig(brokerArray, producer, consumer)
        log("Got Device List")
        tp1 = TopicPartition(admin_devices_topic, 0)
        tp2 = TopicPartition(admin_topic, 0)
        consumer.assign([tp1, tp2])
        log("Assigned Topics")
        consumer.seek_to_end()
        foundConfig = 1

        message = {}

        producer.send(admin_devices_topic, genericMessage("get", name, message))
        log("Sent Devices Config Request")
        tagDatabase = []

        tic = time.time()
        while (len(deviceList) > 0) and (time.time() < (DEFAULT_TIMEOUT_S + tic)):
            messages = consumer.poll()
            if tp1 in messages:
                for message in messages[tp1]:
                    m = json.loads(message.value)
                    if m['cmd'] == 'config-simulation':
                        log("Passed Config Message")
                        if m['name'] in deviceList:
                            deviceList.remove(m['name'])
                            for t in m['message']['tags']:
                                tagDatabase.append({ 'name': t,
                                                    'value': m['message']['tags'][t]['value'],
                                                    'description': m['message']['tags'][t]['description'],
                                                    'enghigh': m['message']['tags'][t]['enghigh'],
                                                    'englow': m['message']['tags'][t]['englow'],
                                                    'rawhigh': m['message']['tags'][t]['rawhigh'],
                                                    'rawlow': m['message']['tags'][t]['rawlow'],
                                                    'eu': m['message']['tags'][t]['eu'],
                                                    'type': m['message']['tags'][t]['type'],
                                                    'device': m['name']
                                                    })

                            foundConfig += 1

        lastUpdate = time.time()
        return tagDatabase

def updateDeviceConfig(brokerArray, producer, consumer):
        #producer = KafkaProducer(bootstrap_servers=brokerArray, acks=0, linger_ms=1000, batch_size=1000000)
        #consumer = KafkaConsumer(bootstrap_servers=brokerArray,
        #                                  max_poll_interval_ms=1000,
        #                                  group_id=group_id_suffix + "-" + name,
        #                                  auto_commit_interval_ms=500 )
        tic = time.time()
        log("Starting Device Config Update")
        deviceList = getAgentConfig(brokerArray, producer, consumer)
        log("Got Device List")
        tp1 = TopicPartition(admin_devices_topic, 0)
        tp2 = TopicPartition(admin_topic, 0)
        consumer.assign([tp1, tp2])
        log("Assigned Topics")
        consumer.seek_to_end()
        foundConfig = 1

        message = {}

        producer.send(admin_devices_topic, genericMessage("get", name, message))
        log("Sent Devices Config Request")
        deviceDatabase = []

        tic = time.time()
        while (len(deviceList) > 0) and (time.time() < (DEFAULT_TIMEOUT_S + tic)):
            messages = consumer.poll()
            if tp1 in messages:
                for message in messages[tp1]:
                    m = json.loads(message.value)
                    if m['cmd'] == 'config-simulation':
                        log("Passed Config Message")
                        if m['name'] in deviceList:
                            deviceList.remove(m['name'])
                            deviceDatabase.append({ 'name': m['name'],
                                                    'type': m['message']['type'],
                                                    'tagCount': len(m['message']['tags']),
                                                    'replication': m['message']['replication'],
                                                    'scantime': m['message']['scantime']
                                                    })
                            foundConfig += 1

        lastUpdate = time.time()
        return deviceDatabase

def updateClientConfig(brokerArray, producer, consumer):
        #producer = KafkaProducer(bootstrap_servers=brokerArray, acks=0, linger_ms=1000, batch_size=1000000)
        #consumer = KafkaConsumer(bootstrap_servers=brokerArray,
        #                                  max_poll_interval_ms=1000,
        #                                  group_id=group_id_suffix + "-" + name,
        #                                  auto_commit_interval_ms=500 )
        tic = time.time()
        log("Starting Device Config Update")
        deviceList = getClientConfig(brokerArray, producer, consumer)
        log("Got Device List")
        tp1 = TopicPartition(admin_devices_topic, 0)
        consumer.assign([tp1])
        log("Assigned Topics")
        consumer.seek_to_end()
        foundConfig = 1

        message = {}

        producer.send(admin_devices_topic, genericMessage("get", name, message))
        log("Sent Devices Config Request")
        deviceDatabase = []

        tic = time.time()
        while (len(deviceList) > 0) and (time.time() < (DEFAULT_TIMEOUT_S + tic)):
            messages = consumer.poll()
            if tp1 in messages:
                for message in messages[tp1]:
                    m = json.loads(message.value)
                    if m['cmd'] == 'config-client':
                        log(m)
                        log(message)
                        log("Passed Config Message")
                        if m['name'] in deviceList:
                            deviceList.remove(m['name'])
                            deviceDatabase.append({ 'name': m['name'],
                                                    'type': m['message']['type'],
                                                    'tagCount': len(m['message']['tags']),
                                                    'replication': m['message']['replication'],
                                                    'scantime': m['message']['scantime']
                                                    })
                            foundConfig += 1

        lastUpdate = time.time()
        return deviceDatabase

def openConsumer(brokerArray):
    consumer = KafkaConsumer(bootstrap_servers=brokerArray,
                                  max_poll_interval_ms=1000,
                                  group_id=name,
                                  auto_commit_interval_ms=500,
                                  auto_offset_reset='latest')
    return consumer

def openProducer(brokerArray):
    producer = KafkaProducer(bootstrap_servers=brokerArray, acks=0, linger_ms=1000, batch_size=1000000)
    return producer

def login(username, password):
    pass

def createFlask():
    app = flask.Flask(__name__)
    app.config["DEBUG"] = FLASK_DEBUG
    app.config["SERVER_NAME"] = "localhost:" + str(FLASK_PORT)
    app.secret_key = uuid.uuid4()
    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ckSCADA Agent.')
    parser.add_argument('--configfile', default='config.json',
                       help='config file to use (default: config.json)')

    processes = {}

    log("Starting ckSCADA Web Agent on " + name)
    args = parser.parse_args()

    log("Reading config file " + args.configfile)
    f = open(args.configfile)
    data = json.load(f)

    brokerArray = []
    for broker in data['brokers']:
        brokerArray.append(broker['host'] + ":" + str(broker['port']))
    log("Attempting to communicate with cluster:- " + str(brokerArray))

    app = createFlask()

    @app.route('/api/topics', methods=['GET'])
    def topics():
        filter = flask.request.args.get('filter')
        if filter == None:
            filter = ""

        consumer = openConsumer(brokerArray)

        topics = consumer.topics()

        returnTopics = []

        for n in topics:
            if filter in n:
                returnTopics.append({"name": n})
        return json.dumps(returnTopics)

    @app.route('/api/cleanup', methods=['GET'])
    def cleanup():
        filter = flask.request.args.get('filter')
        if filter == None:
            filter = ""

        consumer = openConsumer(brokerArray)
        admin_client = KafkaAdminClient(bootstrap_servers=brokerArray)

        topics = consumer.topics()

        returnTopicCount = 0

        for n in topics:
            log("Found Topic - " + n)
            if filter in n:
                tp = TopicPartition(n, 0)
                consumer.assign([tp])
                lastOffset = consumer.end_offsets([tp])[tp]
                log("Found Topic - " + str(lastOffset))
                readOffset = 0
                if lastOffset > 0:
                    readOffset = lastOffset - 1

                consumer.seek(tp, readOffset)

                messages = consumer.poll(timeout_ms=1000)
                log("Found Topic - " + str(messages))
                if tp in messages:
                    log("Removing Topic - " + str(messages[tp][0].timestamp))
                    if messages[tp][0].timestamp < ((time.time() - DEFAULT_CLEANUP_TIME)*1000):
                        log("Deleting Topic - " + n)
                        admin_client.delete_topics([n])
                        returnTopicCount += 1
                elif (readOffset == 0) or (len(messages) == 0):
                    log("Deleting Topic - " + n)
                    admin_client.delete_topics([n])
                    returnTopicCount += 1
        return "Deleted " + str(returnTopicCount) + " Topics"



    @app.route('/api/groups', methods=['GET'])
    def groups():

        filter = flask.request.args.get('filter')
        if filter == None:
            filter = ""

        admin_client = KafkaAdminClient(bootstrap_servers=brokerArray)
        consumer_groups = admin_client.list_consumer_groups()
        describeGroups = admin_client.describe_consumer_groups(consumer_groups)
        log(describeGroups)

        returnGroups = []

        for n in consumer_groups:
            if filter in n:
                returnGroups.append({"name": n[0]})
        return json.dumps(returnGroups)

    @app.route('/api/devices', methods=['GET'])
    def devices():

        filter = flask.request.args.get('filter')
        if filter == None:
            filter = ""

        producer = openProducer(brokerArray)
        consumer = openConsumer(brokerArray)

        deviceList = updateDeviceConfig(brokerArray, producer, consumer)

        returnDevices = []

        for n in deviceList:
            if filter in n['name']:
                returnDevices.append(n)
        return json.dumps(returnDevices)



    @app.route('/api/clients', methods=['GET'])
    def clients():

        filter = flask.request.args.get('filter')
        if filter == None:
            filter = ""

        producer = openProducer(brokerArray)
        consumer = openConsumer(brokerArray)

        deviceList = updateClientConfig(brokerArray, producer, consumer)

        returnDevices = []

        for n in deviceList:
            if filter in n['name']:
                returnDevices.append(n)
        return json.dumps(returnDevices)

    @app.route('/api/points', methods=['GET'])
    def points():
        filter = flask.request.args.get('filter')
        if filter == None:
            filter = ""

        tic = time.time()
        consumer = openConsumer(brokerArray)
        producer = openProducer(brokerArray)
        tagDatabase = updateConfig(brokerArray, producer, consumer)

        returnTopics = []

        for n in tagDatabase:
            if filter in n['name']:
                returnTopics.append(n)

        log(time.time() - tic)
        return json.dumps(returnTopics)

    @app.route('/api/points/update', methods=['POST'])
    def updatePoint():
        device = flask.request.json['device']
        name = flask.request.json['name']
        name = re.sub('^' + device + ".", '', name)
        message = flask.request.json

        producer = openProducer(brokerArray)
        producer.send(admin_devices_topic, genericMessage("update", name, message, device))

        return(name + " On Device " + device + " has been updated")

    @app.route('/api/points/add', methods=['POST'])
    def addPoint():
        device = flask.request.json['device']
        name = flask.request.json['name']
        name = re.sub('^' + device + ".", '', name)
        message = flask.request.json

        producer = openProducer(brokerArray)
        producer.send(admin_devices_topic, genericMessage("add", name, message, device))

        return(name + " On Device " + device + " has been added")

    @app.route('/api/points/del', methods=['POST'])
    def delPoint():
        device = flask.request.json['device']
        name = flask.request.json['name']
        name = re.sub('^' + device + ".", '', name)
        message = flask.request.json

        producer = openProducer(brokerArray)
        producer.send(admin_devices_topic, genericMessage("del", name, message, device))

        return(name + " On Device " + device + " has been deleted")

    @app.route('/api/devices/del', methods=['POST'])
    def delDevice():
        name = flask.request.json['name']
        message = flask.request.json

        producer = openProducer(brokerArray)
        producer.send(admin_topic, genericMessage("del", name, message, 'device'))

        return("Device " + name + " has been deleted")

    @app.route('/api/devices/add', methods=['POST'])
    def addDevices():
        name = flask.request.json['name']
        message = flask.request.json

        producer = openProducer(brokerArray)
        producer.send(admin_topic, genericMessage("add", name, message, 'device'))

        return("Device " + name + " has been Added")

    app.run()
