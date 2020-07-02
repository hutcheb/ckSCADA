import React from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";

import { postFormData } from "./BackendComms.js"

class ObjectListModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: props.topic,
      onHide: props.onHide,
      schema: props.schema
    };
  }

  render() {
    if (this.props.show) {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.row.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderModalRow(this.props.row, this.props.col)}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={(ref) => {this.buttonOnClick(ref, 'del')}}>Delete</Button>
            <Button variant="primary" onClick={(ref) => {this.props.onHide(false)}}>Discard Changes</Button>
            <Button variant="primary" onClick={(ref) => {this.buttonOnClick(ref, 'add')}}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return null;
    }
  }

  buttonOnClick(ref, cmd) {
    let r = ref.target.parentElement.parentElement.getElementsByClassName('modalinputclass')
    let row;
    let data = {};
    for (row in r) {
      if (typeof(r[row]) === "object") {
        let tempRow = r[row];
        if (tempRow.children[1].value === "") {
          data[tempRow.children[0].textContent] = tempRow.children[1].getAttribute("placeholder");
        } else {
          data[tempRow.children[0].textContent] = tempRow.children[1].value
        }

      }
    }
    postFormData(this.state.topic, data, cmd);
    this.state.onHide(false);
  }

  modalFormControl(row, col, column, readonly) {
    if (readonly) {
      return (
        <InputGroup className="mb-3 modalinputclass">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">{column[col]}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id="value"
            readOnly
            placeholder={row[column[col]]}
            aria-label={column[col]}
            aria-describedby={column[col]}
          />
        </InputGroup>
      );
    } else {
      return (
        <InputGroup className="mb-3 modalinputclass">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">{column[col]}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id="value"
            placeholder={row[column[col]]}
            aria-label={column[col]}
            aria-describedby={column[col]}
          />
        </InputGroup>
      );
    }
  }

  renderModalRow(row, column) {
    let value = [];
    let col;
    let readOnly = false;

    for (col in column) {
      readOnly = this.state.schema.items.anyOf[0].properties[column[col]].readOnly;
      value.push(this.modalFormControl(row, col, column, readOnly));
    }
    return <div>{value}</div>;
  }

}

export { ObjectListModal };
