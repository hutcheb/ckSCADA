import React from "react";

import ObjectListComponent from "./ObjectListComponent.js";
import logProps from "./common.js";
import deviceSchema from './schema/deviceSchema.js';

class DeviceListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = deviceSchema.deviceSchema;
    this.state.headers = deviceSchema.deviceSchema.items.anyOf[0].required;
    this.state.modalFields = this.getAllFields(deviceSchema.deviceSchema.items.anyOf[0].properties);
    this.state.topic = "devices";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(DeviceListComponent);
