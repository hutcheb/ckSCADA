import axios from "axios";

async function postFormData(topic, data, cmd) {
  axios({
      method: 'post',
      url: 'http://localhost:3000/api/' + topic + "/" + cmd,
      data: data,
      });
}

/**
 * Return the ratio of the inline text length of the links in an element to
 * the inline text length of the entire element.
 *
 */
function getTopicList(topic, filter, callback, setProgress) {
  axios.get('http://localhost:3000/api/' + topic + '?filter=' + filter).then(resp => {
    callback(resp.data);
    let topicString = topic.substring(0, 1).toUpperCase() + topic.substring(1);
    setProgress("Found " + resp.data.length + " " + topicString + ".");
  });
}

export { postFormData, getTopicList };
