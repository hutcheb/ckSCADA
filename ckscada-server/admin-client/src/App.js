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

import "./App.css";
import "./test.js";
import ObjectListComponent from "./ObjectListComponent.js"
import { renderModalRow, MyVerticallyCenteredModal } from "./ObjectListModal.js"
import { postFormData, getTopicList } from "./BackendComms.js"
import Structure from "./structure.js";
import TestData from "./test.js";

import { render } from "react-dom";
import axios from "axios";

function App() {
  const [modalShow, setModalShow] = React.useState(false);
  const [pointsShow, setPointsShow] = React.useState(false);
  const [objectsShow, setObjectsShow] = React.useState(false);
  const [devicesShow, setDevicesShow] = React.useState(false);
  const [topicsShow, setTopicsShow] = React.useState(false);
  const [groupsShow, setGroupsShow] = React.useState(false);
  const [clientsShow, setClientsShow] = React.useState(false);
  const [addButtonShow, setAddButtonShow] = React.useState("hidden");
  const [progress, setProgress] = React.useState("");
  const [topicsList, setTopicsList] = React.useState([{name:'Use Search Bar..'}]);
  const [pointsList, setPointsList] = React.useState([{name:'Use Search Bar..'}]);
  const [groupsList, setGroupsList] = React.useState([{name:'Use Search Bar..'}]);
  const [devicesList, setDevicesList] = React.useState([{name:'Use Search Bar..'}]);
  const [clientsList, setClientsList] = React.useState([{name:'Use Search Bar..'}]);
  const [pageFilter, setFilter] = React.useState("")

  document.addEventListener('copy', function(e) {
    if (pointsShow) {
      e.clipboardData.setData('text/plain', JSON.stringify(pointsList));
    } else if (devicesShow) {
      e.clipboardData.setData('text/plain', JSON.stringify(devicesList));
    } else if (topicsShow) {
      e.clipboardData.setData('text/plain', JSON.stringify(topicsList));
    } else if (groupsShow) {
      e.clipboardData.setData('text/plain', JSON.stringify(groupsList));
    }
    else if (clientsShow) {
      e.clipboardData.setData('text/plain', JSON.stringify(groupsList));
    }
    console.log("Copied to Clipboard")

    e.preventDefault();
  });
  return (
    <Container fluid className="root-container">
      <Row>
        <Col>
          <div className="toolbar-container header">
            <Navbar variant="dark" expand="lg">
              <Navbar.Brand href="#home">ckSCADA</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                  <NavDropdown title="File" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Export
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Import
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.3">
                      Close
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Edit" id="basic-nav-dropdown">
                    <NavDropdown.Item
                    onClick={ () => {
                      //document.copy(JSON.stringify(pointsList))
                      var copyEvent = new ClipboardEvent('copy');
                      console.log(JSON.stringify(pointsList))
                      //pasteEvent.clipboardData.items.add('My string', 'text/plain');
                      document.dispatchEvent(copyEvent);

                    }}
                    href="#action/3.1">Copy</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Cut</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Paster
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
              >
                <Button onClick={(ref) => {setModalShow(true)}}

                 style={{visibility: addButtonShow}}>Add+</Button>
              </Navbar.Collapse>
            </Navbar>

          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div class="content-container ">
            <Row>
              <Col>
                <div class="navigation-container">
                  <div class="inter-project-container" />
                  <div class="project-navigation-container">
                    <div class="project-heading">
                      <Accordion defaultActiveKey="1">
                        <Card>
                          <Accordion.Toggle as={Card.Header} eventKey="0">
                            Project
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body
                              onClick={() => {
                                setPointsShow(true);
                                setGroupsShow(false);
                                setDevicesShow(false);
                                setTopicsShow(false);
                                setClientsShow(false);
                                setAddButtonShow("visible");
                              }}
                            >
                              Points
                            </Card.Body>
                          </Accordion.Collapse>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body
                              onClick={() => {
                                setPointsShow(false);
                                setGroupsShow(false);
                                setDevicesShow(true);
                                setTopicsShow(false);
                                setClientsShow(false);
                                setAddButtonShow("visible");
                              }}
                            >
                              Devices
                            </Card.Body>
                          </Accordion.Collapse>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body
                              onClick={() => {
                                setPointsShow(false);
                                setGroupsShow(false);
                                setDevicesShow(false);
                                setTopicsShow(false);
                                setClientsShow(true);
                                setAddButtonShow("hidden");
                              }}
                            >
                              Clients
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                        <Card>
                          <Accordion.Toggle as={Card.Header} eventKey="1">
                            Kafka
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body
                              onClick={() => {
                                setPointsShow(false);
                                setGroupsShow(false);
                                setDevicesShow(false);
                                setTopicsShow(true);
                                setClientsShow(false);
                                setAddButtonShow("hidden");
                              }}
                            >
                              Topics
                            </Card.Body>
                          </Accordion.Collapse>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body
                              onClick={() => {
                                setPointsShow(false);
                                setGroupsShow(true);
                                setDevicesShow(false);
                                setTopicsShow(false);
                                setClientsShow(false);
                                setAddButtonShow("hidden");
                              }}
                            >
                              Consumer Groups
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={10}>
                <div class="content-display-container">
                  <Row>
                    <Col xs={6}>
                      <div class="tab-navigation" />
                    </Col>
                    <Col />
                  </Row>
                  <Row>
                    <Col>
                      <div class="content-display-overcontainer">
                      <ObjectListComponent
                        schema={Structure.pointListStructure}
                        objectlist={pointsList}
                        show={pointsShow}
                        topic={"points"}
                        pageFilter={pageFilter}
                        onPointsShow={() => setPointsShow(true)}
                        onPointsHide={() => setPointsShow(false)}
                        showModal={modalShow}
                        onModalShow={() => setModalShow(true)}
                        onModalHide={() => setModalShow(false)}
                      />
                      <ObjectListComponent
                        schema={Structure.groupListStructure}
                        objectlist={groupsList}
                        show={groupsShow}
                        topic={"groups"}
                        pageFilter={pageFilter}
                        onPointsShow={() => setGroupsShow(true)}
                        onPointsHide={() => setGroupsShow(false)}
                        showModal={modalShow}
                        onModalShow={() => setModalShow(true)}
                        onModalHide={() => setModalShow(false)}
                      />
                      <ObjectListComponent
                        schema={Structure.deviceListStructure}
                        objectlist={devicesList}
                        show={devicesShow}
                        topic={"devices"}
                        pageFilter={pageFilter}
                        onPointsShow={() => setDevicesShow(true)}
                        onPointsHide={() => setDevicesShow(false)}
                        showModal={modalShow}
                        onModalShow={() => setModalShow(true)}
                        onModalHide={() => setModalShow(false)}
                      />
                      <ObjectListComponent
                        schema={Structure.topicListStructure}
                        objectlist={topicsList}
                        show={topicsShow}
                        topic={"topics"}
                        pageFilter={pageFilter}
                        onPointsShow={() => setTopicsShow(true)}
                        onPointsHide={() => setTopicsShow(false)}
                        showModal={modalShow}
                        onModalShow={() => setModalShow(true)}
                        onModalHide={() => setModalShow(false)}
                      />
                      <ObjectListComponent
                        schema={Structure.clientListStructure}
                        objectlist={clientsList}
                        show={clientsShow}
                        topic={"clients"}
                        pageFilter={pageFilter}
                        onPointsShow={() => setClientsShow(true)}
                        onPointsHide={() => setClientsShow(false)}
                        showModal={modalShow}
                        onModalShow={() => setModalShow(true)}
                        onModalHide={() => setModalShow(false)}
                      />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Navbar variant="dark" sticky="bottom">
            <Navbar.Brand id="status_bar" href="#home">{progress}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Form inline onSubmit={e => { e.preventDefault(); }}>
                <FormControl
                  inputRef={pageFilter}
                  onLoad={ref => { getTopicList("topics", ref.target.value, setTopicsList); getTopicList("points", ref.target.value, setTopicsList)}}
                  onKeyPress={ref => {
                    if (ref.key == 'Enter') {
                      if (topicsShow == true) {
                        setProgress("Loading Topics...");
                        getTopicList("topics", ref.target.value, setTopicsList, setProgress)
                      }
                      if (pointsShow == true) {
                        setProgress("Loading Points...");
                        getTopicList("points", ref.target.value, setPointsList, setProgress)
                      }
                      if (groupsShow == true) {
                        setProgress("Loading Groups...");
                        getTopicList("groups", ref.target.value, setGroupsList, setProgress)
                      }
                      if (devicesShow == true) {
                        setProgress("Loading Devices...");
                        getTopicList("devices", ref.target.value, setDevicesList, setProgress)
                      }
                      if (clientsShow == true) {
                        setProgress("Loading Clients...");
                        getTopicList("clients", ref.target.value, setClientsList, setProgress)
                      }
                    }
                  }}
                  type="text"
                  placeholder="Search"
                  className=" mr-sm-2"
                />
              </Form>
            </Navbar.Collapse>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
