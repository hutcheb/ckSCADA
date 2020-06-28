import React, { useState } from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import Structure from "./structure.js";
import logProps from "./common.js";

class GroupListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = Structure.groupListStructure;
    this.state.topic = "groups";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(GroupListComponent);
