#!/usr/bin/env node

const { Kafka } = require('kafkajs')
const yargs = require('yargs');
const common = require("./common.js")
const topic = "_admin.devices"


function createTag(tagname, device, tagtype, description, rawlow, rawhigh, englow, enghigh, eu, configfile, force=false, log=false) {
    console.log(common.readConfigFile(configfile, log));
    var config = common.readConfigFile(configfile, log);

    kafka = new Kafka({
                      clientId: config.clientid,
                      brokers: config.brokers
                    })

    common.logf("Connecting to topic " + topic, log)
    const producer = kafka.producer()

    const mes = {
            cmd: "add",
            handler: device,
            name: tagname,
            message: {"name": tagname,
                        "value": 0,
                        "description": description,
                        "rawlow": rawlow,
                        "rawhigh": rawhigh,
                        "englow": englow,
                        "enghigh": enghigh,
                        "eu": eu,
                        "type": tagtype},
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

module.exports = { createTag };

if (require.main === module) {
    const yargs = require('yargs');

    const options = yargs
    .usage("Uasage: -d <tagname>")
    .option("n", { alias: "tagname", describe: "The tag name to create", type: "string", demandOption: true })
    .option("d", { alias: "device", describe: "The device to add the tag to", type: "string", demandOption: true })
    .option("t", { alias: "tagtype", describe: "Type of tag (boolean, int, etc..)", type: "string", demandOption: true })
    .option("ds", { alias: "description", describe: "Description of Tag", type: "string", demandOption: true })
    .option("rl", { alias: "rawlow", describe: "Lower Limit of the raw value", type: "string", demandOption: true })
    .option("rh", { alias: "rawhigh", describe: "Higher Limit of the raw value", type: "string", demandOption: true })
    .option("el", { alias: "englow", describe: "Lower Limit of the engineering unit", type: "string", demandOption: true })
    .option("eh", { alias: "enghigh", describe: "Higher Limit of the engineering value", type: "string", demandOption: true })
    .option("eu", { alias: "eu", describe: "Engineering Unit", type: "string", demandOption: false, default: "%" })
    .option("c", { alias: "configfile", describe: "Config file to use", type: "string", demandOption: false, default: "config.json" })
    .option("f", { alias: "force", describe: "Force overwiting of config file", type: "boolean", demandOption: false})
    .argv;

    kafka = createTag(options.tagname, options.device, options.tagtype, options.description, options.rawlow, options.rawhigh, options.englow, options.enghigh, options.eu, options.configfile, options.force, true)
}
