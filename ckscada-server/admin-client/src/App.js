import React from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Ajv from 'ajv';

import pointSchema from './schema/pointSchema.js';
import deviceSchema from './schema/deviceSchema.js';
import clientSchema from './schema/clientSchema.js';
import topicSchema from './schema/topicSchema.js';
import groupSchema from './schema/groupSchema.js';

import "./App.css";
import PointListComponent from "./PointListComponent.js";
import GroupListComponent from "./GroupListComponent.js";
import DeviceListComponent from "./DeviceListComponent.js";
import TopicListComponent from "./TopicListComponent.js";
import ClientListComponent from "./ClientListComponent.js";
import { getTopicList } from "./BackendComms.js";


/**
 * Main React Class
 *
 */
class App extends React.Component {
  /**
   * Main constructor
   *
   */
  constructor(props) {
    super (props);

    this.ajv = new Ajv();
    this.compiledPointSchema = this.ajv.compile(pointSchema);
    this.compiledDeviceSchema = this.ajv.compile(deviceSchema);
    this.compiledClientSchema = this.ajv.compile(clientSchema);
    this.compiledTopicSchema = this.ajv.compile(topicSchema);
    this.compiledGroupSchema = this.ajv.compile(groupSchema);

    this.state = {
      addButtonShow: "hidden",
      progress: "",
      pointsList: [{name:'Use Search Bar..'}],
      groupsList: [{name:'Use Search Bar..'}],
      devicesList: [{name:'Use Search Bar..'}],
      topicsList: [{name:'Use Search Bar..'}],
      clientsList: [{name:'Use Search Bar..'}],
      pageFilter: "",
      PointListDisplayRef: React.createRef(),
      GroupListDisplayRef: React.createRef(),
      DeviceListDisplayRef: React.createRef(),
      TopicListDisplayRef: React.createRef(),
      ClientListDisplayRef: React.createRef()
    };

    this.setAddButtonShow = this.setAddButtonShow.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.setTopicsList = this.setTopicsList.bind(this);
    this.setPointsList = this.setPointsList.bind(this);
    this.setGroupsList = this.setGroupsList.bind(this);
    this.setGroupsList = this.setGroupsList.bind(this);
    this.setDevicesList = this.setDevicesList.bind(this);
    this.setClientsList = this.setClientsList.bind(this);
    this.setFilter = this.setFilter.bind(this);

    this.addCopyEventListener();
  }

  addCopyEventListener() {
    document.addEventListener('copy', function(e) {
      if (this.state.PointListDisplayRef.state.show) {
        e.clipboardData.setData('text/plain', JSON.stringify(this.state.pointsList));
      } else if (this.state.DeviceListDisplayRef.state.show) {
        e.clipboardData.setData('text/plain', JSON.stringify(this.state.devicesList));
      } else if (this.state.TopicListDisplayRef.state.show) {
        e.clipboardData.setData('text/plain', JSON.stringify(this.state.topicsList));
      } else if (this.state.GroupListDisplayRef.state.show) {
        e.clipboardData.setData('text/plain', JSON.stringify(this.state.groupsList));
      }
      else if (this.state.ClientListDisplayRef.state.show) {
        e.clipboardData.setData('text/plain', JSON.stringify(this.state.groupsList));
      }
      console.log("Copied to Clipboard")

      e.preventDefault();
    });
  }

  displayPage(topic) {
    this.state.PointListDisplayRef.current.setShow(false);
    this.state.GroupListDisplayRef.current.setShow(false);
    this.state.DeviceListDisplayRef.current.setShow(false);
    this.state.TopicListDisplayRef.current.setShow(false);
    this.state.ClientListDisplayRef.current.setShow(false);
    switch(topic) {
      case "points":
        this.state.PointListDisplayRef.current.setShow(true);
        this.setAddButtonShow("visible");
        break;
      case "groups":
        this.state.GroupListDisplayRef.current.setShow(true);
        this.setAddButtonShow("hidden");
        break;
      case "devices":
        this.state.DeviceListDisplayRef.current.setShow(true);
        this.setAddButtonShow("visible");
        break;
      case "topics":
        this.state.TopicListDisplayRef.current.setShow(true);
        this.setAddButtonShow("hidden");
        break;
      case "clients":
        this.state.ClientListDisplayRef.current.setShow(true);
        this.setAddButtonShow("hidden");
        break;
    }
  }

  render() {
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
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                  <Button onClick={(ref) => {}}
                   style={{visibility: this.state.addButtonShow}}>
                   Add+
                  </Button>
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
                            <Form onSubmit={e => { e.preventDefault(); }}>
                              <FormControl
                                inputRef={this.state.pageFilter}
                                onKeyPress={ref => {this.queryFilteredList(ref);}}
                                type="text"
                                placeholder="Search"
                              />
                            </Form>
                          </Card>
                          <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                              Project
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body onClick={() => {this.displayPage("points");}}>
                                Points
                              </Card.Body>
                            </Accordion.Collapse>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body onClick={() => {this.displayPage("devices");}}>
                                Devices
                              </Card.Body>
                            </Accordion.Collapse>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body onClick={() => {this.displayPage("clients");}}>
                                Clients
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                          <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                              Kafka
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body onClick={() => {this.displayPage("topics");}}>
                                Topics
                              </Card.Body>
                            </Accordion.Collapse>
                            <Accordion.Collapse eventKey="1">
                              <Card.Body onClick={() => {this.displayPage("groups");}}>
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
                          <PointListComponent
                            objectlist={this.state.pointsList}
                            ref={this.state.PointListDisplayRef}/>
                          <GroupListComponent
                            objectlist={this.state.groupsList}
                            ref={this.state.GroupListDisplayRef}/>
                          <DeviceListComponent
                            objectlist={this.state.devicesList}
                            ref={this.state.DeviceListDisplayRef}/>
                          <TopicListComponent
                            objectlist={this.state.topicsList}
                            ref={this.state.TopicListDisplayRef}/>
                          <ClientListComponent
                            objectlist={this.state.clientsList}
                            ref={this.state.ClientListDisplayRef}/>
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
              <Navbar.Brand id="status_bar" href="#home">{this.state.progress}</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Navbar>
          </Col>
        </Row>
      </Container>
    );
  }

  queryFilteredList(ref) {
    if (ref.key === 'Enter') {
      if (this.state.TopicListDisplayRef.current.state.show === true) {
        this.setProgress("Loading Topics...");
        getTopicList("topics", ref.target.value, this.setTopicsList, this.setProgress)
      }
      if (this.state.PointListDisplayRef.current.state.show === true) {
        this.setProgress("Loading Points...");
        getTopicList("points", ref.target.value, this.setPointsList, this.setProgress)
      }
      if (this.state.GroupListDisplayRef.current.state.show === true) {
        this.setProgress("Loading Groups...");
        getTopicList("groups", ref.target.value, this.setGroupsList, this.setProgress)
      }
      if (this.state.DeviceListDisplayRef.current.state.show === true) {
        this.setProgress("Loading Devices...");
        getTopicList("devices", ref.target.value, this.setDevicesList, this.setProgress)
      }
      if (this.state.ClientListDisplayRef.current.state.show === true) {
        this.setProgress("Loading Clients...");
        getTopicList("clients", ref.target.value, this.setClientsList, this.setProgress)
      }
    }
  }

  setAddButtonShow(status) {
    this.setState({ addButtonShow: status });
  }

  setProgress(status) {
    this.setState({ progress: status });
  }

  setTopicsList(status) {
    var valid = this.compiledTopicSchema(status);
    if (valid) {
      this.setState({ topicsList: status });
    }
  }

  setPointsList(status) {
    var valid = this.compiledPointSchema(status);
    if (valid) {
        this.setState({ pointsList: status });
    }
  }

  setGroupsList(status) {
    var valid = this.compiledGroupSchema(status);
    if (valid) {
      this.setState({ groupsList: status });
    }
  }

  setDevicesList(status) {
    var valid = this.compiledDeviceSchema(status);
    if (valid) {
      this.setState({ devicesList: status });
    }
  }

  setClientsList(status) {
    var valid = this.compiledClientSchema(status);
    if (valid) {
      this.setState({ clientsList: status });
    }
  }

  setFilter(status) {
    this.setState({ pageFilter: status });
  }

}

export default App;
