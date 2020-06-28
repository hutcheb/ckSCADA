import React, { useState } from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import Structure from "./structure.js";
import logProps from "./common.js";

class ClientListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = Structure.clientListStructure;
    this.state.topic = "clients";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(ClientListComponent);
