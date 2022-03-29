#!/usr/bin/env node

const { Kafka } = require('kafkajs')
const yargs = require('yargs');
const common = require("./common.js")
const topic = "_admin.devices"


function getConfig(configfile, force=false, log=false) {
    console.log(common.readConfigFile(configfile, log));
    var config = common.readConfigFile(configfile, log);

    kafka = new Kafka({
                      clientId: config.clientid,
                      brokers: config.brokers
                    })

    common.logf("Connecting to topic " + topic, log)
    const producer = kafka.producer()

    const mes = {
            cmd: "get",
            handler: "",
            name: "cmd-line",
            message: {},
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
    .usage("Usage: ")
    .option("c", { alias: "configfile", describe: "Config file to use", type: "string", demandOption: false, default: "config.json" })
    .option("f", { alias: "force", describe: "Force overwiting of config file", type: "boolean", demandOption: false})
    .argv;

    kafka = getConfig(options.configfile, options.force, true)
}
