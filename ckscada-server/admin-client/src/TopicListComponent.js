import React from "react";
import ObjectListComponent from "./ObjectListComponent.js";
import logProps from "./common.js";
import topicSchema from './schema/topicSchema.js';

class TopicListComponent extends ObjectListComponent {
  constructor(props) {
    super (props);

    this.state.schema = topicSchema.topicSchema;
    this.state.headers = topicSchema.topicSchema.items.anyOf[0].required;
    this.state.topic = "topics";
  }

  render() {
    return (<div>{super.render()}</div>)
  }
}

export default logProps(TopicListComponent);
