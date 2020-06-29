import React from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import Structure from "./structure.js";
import logProps from "./common.js";

class PointListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = Structure.pointListStructure;
    this.state.topic = "points";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(PointListComponent);
