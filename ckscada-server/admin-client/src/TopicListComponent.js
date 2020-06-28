import React, { useState } from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import Structure from "./structure.js";
import logProps from "./common.js";

class TopicListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = Structure.topicListStructure;
    this.state.topic = "topics";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(TopicListComponent);
