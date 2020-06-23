#!/usr/bin/env node
const fs = require('fs');
const { Kafka } = require('kafkajs')
const yargs = require('yargs');
const common = require("./common.js")
const topic = "_admin.devices"
var os = require("os");
var hostname = os.hostname();

function readConfigFile(tagname, device, configfile, log=false) {
    common.logf("Looking for config file " + configfile, log)
    fs.exists(configfile, function(exists) {        
        if (exists) {
            common.logf("Found config file " + configfile, log)
            fs.readFile(configfile, function readFileCallback(err, data) {
                if (err) {
                    console.log(err);                
                } else {                    
                    d = JSON.parse(data)
                    d.clientId = hostname
                    brokers = []
                    d.brokers.forEach(function(s) {
                         brokers.push(s.host + ":" + s.port)
                     })     
                    kafka = new Kafka({
                      clientId: d.clientId,
                      brokers: brokers
                    })                   
                    
                    k = deleteTag(tagname, device, kafka, true)
                    common.logf(k, true)                     
                }
            })            
        } else {
            common.logf(configfile + " does not exist please run ck-create-config", log)
        }
      })
  }

function deleteTag(tagname, device, kafka, log=false) {    
    common.logf("Connecting to topic " + topic, log)
    const producer = kafka.producer()

    const mes = {
            cmd: "del",
            handler: device,
            name: tagname,  
            message: {"name": tagname
                        },                        
            replication: 2
        }                   

    const run = async () => {
      await producer.connect()
      await producer.send({
      topic: topic,      
      messages: [
        { value: JSON.stringify(mes)},
      ],
    })
    
    await producer.disconnect()
    }    
    run()   
}

if (require.main === module) {
    const yargs = require('yargs');
    
    const options = yargs
    .usage("Uasage: -d <tagname>")
    .option("n", { alias: "tagname", describe: "The tag name to delete", type: "string", demandOption: true })
    .option("d", { alias: "device", describe: "The device to delete the tag from", type: "string", demandOption: true })
    .option("c", { alias: "configfile", describe: "Config file to use", type: "string", demandOption: false, default: "config.json" })    
    .argv;
    
    kafka = readConfigFile(options.tagname, options.device, options.configfile, true)        
}
