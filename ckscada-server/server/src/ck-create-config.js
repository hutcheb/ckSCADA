#!/usr/bin/env node
const fs = require('fs');
const { Kafka } = require('kafkajs')
const yargs = require('yargs');
const common = require("./common.js")

function createDefaultConfig (kafka, outputfile, log=false) {   
    fs.writeFile (outputfile, JSON.stringify(kafka,undefined,4), function(err) {
        if (err) throw err;
        common.logf('Finished writing config file ' + outputfile, log);
    })    
}

function connectCluster(servername, port, clientid, outputfile, force=False, log=false) {
    fs.exists(outputfile, function(exists) {        
        if (exists && !force) {
            common.logf(outputfile + " already exists", log)
        } else {
            common.logf("Connecting to ckSCADA server " + servername, log)
            kafka = new Kafka({
              clientId: clientid,
              brokers: [servername + ":" + port]
            })
        
            const admin = kafka.admin()
                               
            async function getClusterInfo() {
                connect = await admin.connect()
                common.logf("Connected to ckSCADA server " + servername, log)
                cluster = await admin.describeCluster()
                common.logf("Found " + cluster.brokers.length + " ckSCADA server(s)", log)        
                cluster.brokers.forEach(function(s){
                        common.logf("Server " + s.nodeId + " - " + s.host + ":" + s.port, log)
                    })
                kafka.brokers = cluster.brokers
                disconnect = await admin.disconnect()
                common.logf("Disconnected from ckSCADA server " + servername, log)
                let values = await Promise.all([connect, cluster, disconnect]);
                createDefaultConfig(kafka, outputfile)          
            }
            getClusterInfo()                       
        }    
    })
}

if (require.main === module) {
    const yargs = require('yargs');
    
    const options = yargs
    .usage("Uasage: -s <servername>")
    .option("s", { alias: "servername", describe: "A ckSCADA server name or IP Address", type: "string", demandOption: true })
    .option("p", { alias: "port", describe: "Port used by server", type: "integer", demandOption: false, default: 9092 })
    .option("i", { alias: "clientid", describe: "Client id used to identify the server", type: "string", demandOption: true})
    .option("o", { alias: "outputfile", describe: "Output file for config file", type: "string", demandOption: false, default: "config.json" })
    .option("f", { alias: "force", describe: "Force overwiting of config file", type: "boolean", demandOption: false})
    .argv;

    k = connectCluster(options.servername, options.port, options.clientid, options.outputfile, options.force, true)
    common.logf(k, true) 
}
