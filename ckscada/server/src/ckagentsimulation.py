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


class Simulation(PeriodicDevice):

    def __init__(self, brokerArray, name, message, replication, scantime):
        super().__init__(brokerArray, name, message, replication, scantime)
        self.tagTypes = {"int": self.int, "boolean": self.boolean, "datetime": self.datetime, "stored": self.stored}
        self.type = "simulation"
        self.main()

    def setTag(self, name, message):
        log("Setting Tag " + self.name + "." +  str(message['message']['name']))
        self.tags[name]['value']  = message['message']['value']

    def delTag(self, tag, message, removeTopic=True):
        print("Deleting Tag " + tag + " from " + self.name)
        self.tags.pop(tag)

    def addTag(self, name, message):
        log("Adding Tag " + self.name + "." + str(message['message']['name']))
        self.tags[name] = {"name": message['message']['name'],
                            "value": message['message']['value'],
                            "description": message['message']['description'],
                            "rawlow": message['message']['rawlow'],
                            "rawhigh": message['message']['rawhigh'],
                            "englow": message['message']['englow'],
                            "enghigh": message['message']['enghigh'],
                            "eu": message['message']['eu'],
                            "type": message['message']['type']}

    def int(self,tag=""):
        return(random.random()*100)

    def datetime(self,tag=""):
        return(str(datetime.datetime.now().time()))

    def stored(self,tag):
        return(str(tag['value']))

    def boolean(self,tag=""):
        if random.random() > 0.5:
            return 1
        else:
            return 0

    def updateTags(self):
        for tag in self.tags:
            self.updateTagValue(self.tags[tag])

    def updateTagValue(self, tag):
        message = { 'id': random.randint(0, 1000000),
                    'name': tag["name"],
                    'value': self.tagTypes[tag["type"]](tag),
                    'description': tag["description"],
                    'rawlow': tag["rawlow"],
                    'rawhigh': tag["rawhigh"],
                    'englow': tag["englow"],
                    'enghigh': tag["enghigh"],
                    'eu': tag["eu"],
                    'type': tag["type"]
                    }
        tag["value"] = message['value']
        self.producer.send(self.name, genericMessage("tag-update", self.group_id + "." + tag['name'], message))
