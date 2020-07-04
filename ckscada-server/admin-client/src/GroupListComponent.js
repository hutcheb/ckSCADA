import React from "react";

import ObjectListComponent from "./ObjectListComponent.js";
import logProps from "./common.js";
import groupSchema from './schema/groupSchema.js';

class GroupListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = groupSchema.groupSchema;
    this.state.headers = groupSchema.groupSchema.items.anyOf[0].required;
    this.state.modalFields = this.getAllFields(groupSchema.groupSchema.items.anyOf[0].properties);
    this.state.topic = "groups";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(GroupListComponent);
