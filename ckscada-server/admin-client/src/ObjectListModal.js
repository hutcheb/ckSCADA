import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import ProgressBar from "react-bootstrap/ProgressBar";

import { postFormData, getTopicList } from "./BackendComms.js"

class ObjectListModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: props.topic,
      onHide: props.onHide
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

  renderModalRow(row, column) {
    let value = [];
    let col;

    for (col in column) {
      value.push(
        <InputGroup className="mb-3 modalinputclass">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">{col}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id="value"
            placeholder={row[col]}
            aria-label={col}
            aria-describedby={col}
          />
        </InputGroup>
      );
    }
    return <div>{value}</div>;
  }

}

export { ObjectListModal };
