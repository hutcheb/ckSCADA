from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka import KafkaAdminClient
from kafka import TopicPartition
import time
import datetime
import json
import socket
import random

from ckscada.server.src.ckagentdevice import Device, PeriodicDevice
from ckscada.server.src.ckcommon import log, genericMessage


class Client(PeriodicDevice):

    def __init__(self, brokerArray, name, message, replication, scantime):
        super().__init__(brokerArray, name, message, replication, scantime)

        self.tags = {}
        self.topics = []
        self.type = "client"
        self.enableDevice = False
        self.consumer = KafkaConsumer(bootstrap_servers=self.brokerArray,
                                                   group_id=self.group_id)
        self.dieEnabled = True
        self.main()

    def delTag(self, tag, message, removeTopic=True):
        print("Deleting Tag " + tag + " from " + self.name)
        if tag in self.topics:
            self.topics.remove(tag)
            self.tags.pop(tag)

    def addTag(self, name, message):
        log("Adding Tag " + self.name + "." + str(message['message']['name']))
        tp = TopicPartition(message['message']['topic'], 0)
        self.tags[str(message['message']['name'])] = ({"name": message['message']['name'],
                            "topic": tp})
        self.topics.append(tp)
        self.consumer.assign(self.topics)
        self.consumer.seek_to_end(tp)

    def updateTags(self):
        messages = self.consumer.poll(timeout_ms=self.scantime)
        if not (messages == {}):
            for t in self.topics:
                for message in messages[t]:
                    m = super().parseMessage(message.value)
                    if m['name'] in self.tags:
                        self.updateTagValue(m['name'], m['message'])

    def updateTagValue(self, tag, message):
        self.producer.send(self.name, genericMessage("tag-update", tag, message))
