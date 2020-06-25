/*
 * ckviewer.js
 *
 * Copyright 2020 Ben Hutcheson <ben.hutche@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 *
 */
const common = require("./common.js");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Kafka } = require('kafkajs');
const anime = require('animejs');
const fs = require('fs');
const adminTopic = '_admin.devices'
var os = require("os");
var svgPath = "./svg/"
var hostname = os.hostname();
var clientId = "client-" + hostname + "-" + uuidv4();
var consumer = undefined;
var producer = undefined;
var kafka = undefined;
var tagList = {};
var scriptList = {};
var objectList = {};

/**
 *
 * name:            changePage
 * description:     Opens a html/svg file and inserts it into the root
 *                  div within the body element.
 * @param {string}  filename        Filename of the screen to display.
 *                                  This should a html/svg file that can
 *                                  inserted into the body of a html
 *                                  file.
 *
 */
async function changePage(filename) {
    common.logf("Looking for web file " + filename, true);

    let exists = false;
    exists = fs.existsSync(filename);

    if (exists) {
        common.logf("Found web file " + filename, true);
        let data = fs.readFileSync(filename);

        root = document.getElementById('root');
        root.innerHTML = data;

        title = document.getElementsByTagName('title')
        if (typeof title !== "undefined") {
            if (title.length > 1) {
                document.getElementById('root-title').innerHTML = title[1].innerHTML;
            } else {
                common.logf("No title element found on page, Leaving Window header as is");
            }
        }

        scripts = root.getElementsByTagName('script');
        if (typeof scripts !== "undefined") {
            for (s=0;s < scripts.length; s++) {
                eval(scripts[s].innerHTML);
            }
        }
    } else {
        common.logf(filename + " does not exist please confirm", true)
    }

    await updateTopics();
}

function appendElementToTagList(tagList, tag, e) {
    if (e.id == "") {
        e.id = uuidv4();
    }

    topic = tag.split("!")[0]
    d = topic.split(".")[0]
    p = tag.split("!")[1]

    if (typeof tagList[topic] == "undefined") {
        tagList[topic] = [{ element: e.id, parameter: p, device: d }]
    } else {
        tagList[topic].push({ element: e.id, parameter: p, device: d });
    }
}

function getTags() {
    ckTagList = document.getElementsByClassName("cktag");
    tagList = {};

    for (t=0; t < ckTagList.length; t++) {
        appendElementToTagList(tagList, ckTagList[t].getAttribute("name"), ckTagList[t]);
    }
    return tagList;
}

function getScripts() {
    ckScriptList = document.getElementsByClassName("ckscript");
    scriptList = {};
    for (t=0; t < ckScriptList.length; t++) {
        parent = ckScriptList[t].parentElement;
        ckParameterList = parent.getElementsByClassName("ckparameter");

        for (p=0; p < ckParameterList.length; p++) {
            appendElementToTagList(scriptList, ckParameterList[p].innerHTML, parent);
        }
    }
    return scriptList;
}

function getObjects(tagList) {
    ckObjectList = document.getElementsByClassName("ckobject");

    for (t=0; t < ckObjectList.length; t++) {
        appendElementToTagList(tagList, ckTagList[t].name, ckTagList[t]);
    }


    for (t = 0; t < ckTagList.length; t++) {
        var desc = ckTagList[t].getElementsByTagName("desc")[0].innerHTML;
        parameters = JSON.parse(desc);

        for (p in parameters) {
            ckParameterList = ckTagList[t].getElementsByClassName("ckParameter!" + p);

            for (e = 0; e < ckParameterList.length; e++) {
                ckParameterList[e].id = uuidv4();

                if (typeof tagList[parameters[p].split("!")[0]] !== "undefined") {
                    tagList[parameters[p].split("!")[0]].push({ element: ckParameterList[e].id, parameter: parameters[p].split("!")[1] });
                } else {
                    tagList[parameters[p].split("!")[0]] = [{ element: ckParameterList[e].id, parameter: parameters[p].split("!")[1] }]
                }
            }

        }
    }
}

function replaceObjects() {
    ckObjectList = document.getElementsByClassName("ckobject");

    for (i=0; i < ckObjectList.length; i ++) {
        let filename = getFilePath(ckObjectList[i].getAttribute("xlink:href"));              
        let exists = false;
        exists = fs.existsSync(filename);

        if (exists) {
            common.logf("Found object file " + filename, true);
            parent = ckObjectList[i].parentElement
            let data = fs.readFileSync(filename).toString('utf8');
            data = data.replace("$Object", ckObjectList[i].getAttribute("object"));
            let parser = new DOMParser();
            let parsedHtml = parser.parseFromString(data, 'text/html');
            group = parsedHtml.documentElement.getElementsByTagName("g")[0];
            parent.replaceChild(group, ckObjectList[i]);
        }
    }
}

async function sendAdminUpdate(cmd, tag, topic) {
    message = { 'name': tag, 'topic': topic };
    str = genericMessage(cmd, tag , message, clientId, 1);

    await producer.send({
      topic: "_admin.devices",
      messages: [ {value: str
       },
      ],
    })
}

async function createClient() {
    message = { 'name': clientId, 'type': 'client', 'scantime': 50 };
    str = genericMessageDevice('add', clientId , message, 'device', 1, 50);
    await producer.send({
      topic: "_admin",
      messages: [ {value: str
       },
      ],
    })
}

async function updateTopics() {

    replaceObjects();

    for (i in tagList) {
      sendAdminUpdate('del', i, tagList[i].topic);
    }
    for (i in scriptList) {
      sendAdminUpdate('del', i, tagList[i].topic);
    }

    tagList = {};
    objectList = {};

    tagList = getTags();
    scriptList = getScripts();

    for (i in tagList) {
      sendAdminUpdate('add', i, tagList[i][0].device);
    }
    for (i in scriptList) {
      sendAdminUpdate('add', i, tagList[i][0].device);
    }

    await consumer.subscribe({ topic: clientId, fromBeginning: false})
    die();
    await loop();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function die() {
  while (true) {
    m_8373 = { 'name': clientId };
    s_8373 = genericMessage('die-reset', clientId , m_8373, clientId, 1);
    console.log(s_8373);
    await producer.send({
      topic: "_admin.devices",
      messages: [ {value: s_8373
       },
      ],
    })
    await sleep(5000)
  }

}

function genericMessage(cmd, name, message, handler="", replication=1) {
    return JSON.stringify({
       'cmd': cmd,
       'name' : name,
       'handler' : handler,
       'message': message,
       'replication': replication
        });
}

function genericMessageDevice(cmd, name, message, handler="", replication=1, scantime=1000) {
    return JSON.stringify({
       'cmd': cmd,
       'name' : name,
       'handler' : handler,
       'message': message,
       'replication': replication,
       'scantime': scantime
        });
}


function getString(topic, v) {
    return JSON.stringify({
       'cmd': 'set',
       'name' : "Stored",
       'handler' : 'Simulated.Flow.Transmitter',
       'message': { name: "Stored", value: "1.0" }
        });

}

async function setTag(topic, v) {
  str = getString(topic, v);
  await producer.send({
    topic: "_admin.devices",
    messages: [ {value: str
     },
    ],
  })

}

function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    js = js.replace('&gt;', '>')
    js = js.replace('&lt;', '<')
    return async function() { return eval("(async () => {" + js + "})()"); }.call(context);
}

function rendercktag(e, m) {
    if (e.parameter != 'type' && e.parameter != 'name' && e.parameter != 'eu') {
        f = common.renderVariable(m.message['type'], m.message[e.parameter]);
    }
    if (e.parameter == 'eu') {
        f = common.renderVariable('string', m.message[e.parameter]);
    }
    if (e.parameter == 'type') {
        f = common.renderVariable('string', m.message[value]);
    }
    if (e.parameter == 'name') {
        f = common.renderVariable('string', m.message[value]);
    }


    context = document.getElementById(e.element);
    nodes = context.childNodes;
    let found = false;
    for (node= nodes.length - 1; node >= 0; node--) {
        if (nodes[node].nodeType == Node.TEXT_NODE) {
            found = true;
            nodes[node].textContent = f.toString();
        }
        if (found) {
            break;
        }

    }
}

async function renderckscript(e, m) {
    context = document.getElementById(e.element);
    script = context.getElementsByClassName("ckscript")[0].innerHTML
    value = m.message[e.parameter];
    await evalInContext(script, { e: context, v: value });
}

async function loop() {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {

        m = JSON.parse(message.value)
        tag = m['name']
        if ( tagList[tag] !== undefined ) {
            for (e=0; e < tagList[tag].length; e++) {
                rendercktag(tagList[tag][e], m)
            }
        }


        if ( scriptList[tag] !== undefined ) {
            for (e=0; e < scriptList[tag].length; e++) {
                renderckscript(scriptList[tag][e], m)
            }
        }

      }})
}

function getFilePath(filename) {
  return path.format({
    root: '/ignored',
    dir: svgPath,
    base: filename
  });

}

/*
 *
 * name:            run
 * description:     Used to initiate the main loop of the viewer. This
 *                  loop handles recieving messages from kafka and
 *                  displaying on the screen.
 * @param
 * @return
 *
 */
function run(config) {

    var config = common.readConfigFile('./config/config.json', true);

    const start = async function() {
          kafka = new Kafka({
          clientId: config.clientid,
          brokers: config.brokers
          })

        producer = kafka.producer();
        await producer.connect()

        //Create a random group id, this seems to improve the connection time for the consumer.
        consumer = kafka.consumer({ groupId: uuidv4(), maxWaitTimeInMs: 10 })
        await consumer.connect()

        createClient()

        await changePage(getFilePath('welcome.svg'));
    }
    start();
}

module.exports.run = run
module.exports.changePage = changePage
