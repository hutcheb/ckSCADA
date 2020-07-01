import React from "react";

import ObjectListComponent from "./ObjectListComponent.js";
import logProps from "./common.js";
import clientSchema from './schema/clientSchema.js';

class ClientListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = clientSchema.clientSchema;
    this.state.headers = clientSchema.clientSchema.items.anyOf[0].required;
    this.state.topic = "clients";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(ClientListComponent);
