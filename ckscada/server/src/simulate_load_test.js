#!/usr/bin/env node
const ckdevice = require('./ck-create-device.js');
const cktag = require('./ck-create-tag.js');
const common = require("./common.js")
const topic = "_admin.devices"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function running() {
  for (i=0; i<5; i++) {
    ckdevice.readConfigFile("Simulated_Load_Test_" + i, "simulation", 1000, "../../config/config.json", false, true)
  }
  await sleep(10000);

  for (i=0; i<5; i++) {
    for (j=0; j<1000; j++) {
      cktag.createTag("Test_Tag_Name_" + j, "Simulated_Load_Test_" + i, "int", "Description Text", 0, i, 0, j, "%", "../../config/config.json", false, true)
      await sleep(10);
    }
  }
}

if (require.main === module) {
    console.log("Hello")
    running();
}
