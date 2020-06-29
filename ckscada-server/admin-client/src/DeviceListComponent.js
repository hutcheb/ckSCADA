import React from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import Structure from "./structure.js";
import logProps from "./common.js";

class DeviceListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = Structure.deviceListStructure;
    this.state.topic = "devices";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(DeviceListComponent);
