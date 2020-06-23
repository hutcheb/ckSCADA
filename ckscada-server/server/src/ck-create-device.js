#!/usr/bin/env node
const fs = require('fs');
const { Kafka } = require('kafkajs')
const yargs = require('yargs');
const common = require("./common.js")
const topic = "_admin"
var os = require("os");
var hostname = os.hostname();

function readConfigFile(devicename, devicetype, scantime, configfile, force=false, log=false) {
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

                    k = createDevice(devicename, devicetype, scantime, kafka, force, true)
                    common.logf(k, true)
                }
            })
        } else {
            common.logf(configfile + " does not exist please run ck-create-config", log)
        }
      })
  }

function createDevice(devicename, devicetype, scantime, kafka, force=false, log=false) {
    common.logf("Connecting to topic " + topic, log)
    const producer = kafka.producer()

    const mes = {
            cmd: "add",
            handler: "device",
            name: devicename,
            message: { type: devicetype, scantime: scantime },
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

module.exports = { createDevice, readConfigFile };

if (require.main === module) {
    const yargs = require('yargs');

    const options = yargs
    .usage("Uasage: -d <devicename")
    .option("d", { alias: "devicename", describe: "The device name to create", type: "string", demandOption: true })
    .option("t", { alias: "devicetype", describe: "Type of Device (opc client, simulation, modbus, etc..)", type: "string" })
    .option("s", { alias: "scantime", describe: "Scan rate of device", type: "string",  demandOption: false, default: "1000" })
    .option("c", { alias: "configfile", describe: "Config file to use", type: "string", demandOption: false, default: "config.json" })
    .option("f", { alias: "force", describe: "Force overwiting of config file", type: "boolean", demandOption: false})
    .argv;

    kafka = readConfigFile(options.devicename, options.devicetype, options.scantime, options.configfile, options.force, true)
}
