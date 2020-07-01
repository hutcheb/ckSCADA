import React from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import logProps from "./common.js";
import pointSchema from './schema/pointSchema.js';

class PointListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = pointSchema.pointSchema;
    this.state.headers = pointSchema.pointSchema.items.anyOf[0].required;
    this.state.topic = "points";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(PointListComponent);
