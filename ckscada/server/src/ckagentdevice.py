from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka import KafkaAdminClient
from kafka import TopicPartition
import time
import datetime
import json
import socket
import random
import uuid

from ckscada.server.src.ckcommon import log, genericMessage


class NotImplmentedError:
    pass


class Device():

    admin_topic = '_admin.devices'
    peerTimeoutFactor = 5

    def __init__(self, brokerArray, name, message, replication, timeout=10):
        self.name = name
        self.type = ""
        self.enableDevice = False
        self.tags = {}
        self.peers = {}
        self.idCount = 0
        self.dieEnabled = False
        self.dieTimeout = 30
        self.dieTimer = time.time()

        #Kafka Specific
        self.timeout = int(timeout)
        self.replication = replication
        self.brokerArray = brokerArray
        self.group_id = self.name
        self.producer = KafkaProducer(bootstrap_servers=self.brokerArray,
                                      compression_type="gzip",
                                      buffer_memory=100000000,
                                      acks=0,
                                      linger_ms=self.timeout,
                                      batch_size=1000000)
        self.admin_device_consumer = KafkaConsumer(bootstrap_servers=self.brokerArray,
                                                   group_id=self.group_id)
        self.admin_tp = TopicPartition(Device.admin_topic, 0)
        self.admin_device_consumer.assign([self.admin_tp])
        self.admin_device_consumer.seek_to_end()

    def dieCheck(self):
        self.dieTimer = time.time()

    def checkPeers(self):
        enabledCount = 0
        peerTimeout = (Device.peerTimeoutFactor * (self.timeout/1000))
        for peer in self.peers:
            if (time.time() < (self.peers[peer] + peerTimeout)):
                enabledCount += 1
        if (enabledCount <= self.replication):
            self.enableDevice = True
        else:
            self.enableDevice = False

    def main(self):
        raise NotImplmentedError

    def updateTags(self):
        raise NotImplementedError

    def addTag(self, name, message):
        raise NotImplementedError

    def setTag(self, name, message):
        raise NotImplementedError

    def delTag(self, name, message, removeTopic=True):
        raise NotImplementedError

    def getConfig(self, name, message):
        message = { 'name': self.name,
                    'type': self.type,
                    'tags': self.tags,
                    'replication': self.replication,
                    'scantime': self.scantime
                    }
        self.producer.send(Device.admin_topic, genericMessage("config-" + self.type, self.name, message, name, self.replication))

    def getId(self):
        self.idCount += 1
        if self.idCount > 100000:
            self.idCount = 0
        return self.idCount

    def keepAlive(self):
        m = { 'enabled': self.enableDevice,
              'name': self.name,
              'id': self.getId() }
        message = genericMessage("keep-alive", self.group_id, m, self.group_id, self.replication)
        self.producer.send(Device.admin_topic, message)

    def parseMessage(self, message):
        return json.loads(message)

    def waitForMessages(self, brokerArray, name, timeout):
        messages = self.admin_device_consumer.poll(timeout_ms=timeout)
        if not (messages == {}):
            for message in messages[self.admin_tp]:
                m = self.parseMessage(message.value)
                if m['handler'] == self.name:
                    if m['cmd'] == 'del':
                        if m['name'] in self.tags:
                            self.delTag(m['name'], m)
                        else:
                            log("Tag " + m['name'] + " not found for deletion")
                    if m['cmd'] == 'update' or m['cmd'] == 'add':
                        if m['name'] in self.tags:
                            self.delTag(m['name'], m, False)
                            self.addTag(m['name'], m)
                        else:
                            self.addTag(m['name'], m)
                    if m['cmd'] == 'set':
                        if m['name'] in self.tags:
                            self.setTag(m['name'], m)
                        else:
                            log("Tag " + m['name'] + " not found for setting")
                    if m['cmd'] == 'die-reset':
                        log("Die Check - " + str(time.time() - self.dieTimer))
                        self.dieCheck()
                if m['cmd'] == 'get':
                    log(self.name + " - Recieved Config Message")
                    if self.enableDevice:
                        self.getConfig(m['name'], m)
                if m['cmd'] == 'keep-alive':
                    if m['name'] == self.name:
                        if m['message']['enabled']:
                            self.peers[m['handler']] = time.time()
                        if not m['message']['enabled'] and m['name'] == self.name:
                            self.peers[m['handler']] = time.time()

class PeriodicDevice(Device):

    def __init__(self, brokerArray, name, message, replication, scantime):
        super().__init__(brokerArray, name, message, replication, scantime)
        self.scantime = int(scantime)

    def main(self):
        self.lastTime = self.scantime
        cycleCount = 0
        while(True):
            cycleCount += 1
            tic = time.time()

            self.producer.linger_ms = int(self.lastTime)/2

            if self.enableDevice:
                self.updateTags()

            if not self.enableDevice:
                self.checkPeers()

            self.keepAlive()

            if self.dieEnabled:
                if time.time() > (self.dieTimer + self.dieTimeout):
                    log("Killing process due to client timeout - " + self.name)
                    break
            else:
                self.dieTimer = time.time()

            self.lastTime = (time.time() - tic) * 1000
            if ((cycleCount % 20) ==0):
                log(self.name + " - Cycle Time - " + str(self.lastTime))

            self.cleanup()


    def cleanup(self):
        """
        Perform communication functions

        Sets aside at least 10% of the scan time to perform communication functions
        """
        waitTime = (self.scantime - self.lastTime)
        startTime = time.time()
        if waitTime <= self.scantime * 0.1:
            waitTime = self.scantime * 0.1
        self.waitForMessages(self.brokerArray, self.name, waitTime)
        sleepTime = waitTime - (time.time() - startTime)
        if sleepTime < 0.0:
            sleepTime = 0.0
        time.sleep(sleepTime/1000)
