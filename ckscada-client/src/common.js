const fs = require('fs');
var os = require("os");
var hostname = os.hostname();

function logf (string, runFromConsole) {
    if (runFromConsole) {
        var d = new Date(Date.now());      
        console.log(d.toLocaleString() + " - " + string)
    }
}
    
function readConfigFile(configfile, log=false) {
    logf("Looking for config file " + configfile, log)
    
    let exists = false;
    exists = fs.existsSync(configfile);
    
    if (exists) {
        logf("Found config file " + configfile, log);
        let data = fs.readFileSync(configfile);        
                
        d = JSON.parse(data)
        d.clientId = hostname
        brokers = []
        d.brokers.forEach(function(s) {
             brokers.push(s.host + ":" + s.port)
         })
         console.log("Testing " +  d.clientId);
        return({ "clientid": d.clientId, "brokers": brokers });                
                                  
    } else {
        logf(configfile + " does not exist please run ck-create-config", log)
    }
}

function renderVariable(type, value, parameters={}) {
    if (type == 'int') {        
        return parseInt(value).toFixed(0);
    }
    if (type == 'showtime') {        
        return value;
    }
    if (type =='float') {
        return parseInt(value).toFixed(parameters.dec);
    }
    if (type =='boolean') {
        test = parseInt(value)
        if (test > 0) {
            return true;
        } else {
            return false;
        }
    }
    if (type == 'string') {
        return value;
    }
    if (type == 'stored') {
        return parseInt(value).toFixed(0);
    } 
}


module.exports.logf = logf
module.exports.readConfigFile = readConfigFile
module.exports.renderVariable = renderVariable

