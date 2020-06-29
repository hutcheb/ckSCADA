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

import "./App.css";
import PointListComponent from "./PointListComponent.js";
import GroupListComponent from "./GroupListComponent.js";
import DeviceListComponent from "./DeviceListComponent.js";
import TopicListComponent from "./TopicListComponent.js";
import ClientListComponent from "./ClientListComponent.js";
import { getTopicList } from "./BackendComms.js";

function App() {
  const PointListDisplayRef = React.createRef();
  const GroupListDisplayRef = React.createRef();
  const DeviceListDisplayRef = React.createRef();
  const TopicListDisplayRef = React.createRef();
  const ClientListDisplayRef = React.createRef();

  const [addButtonShow, setAddButtonShow] = React.useState("hidden");
  const [progress, setProgress] = React.useState("");
  const [topicsList, setTopicsList] = React.useState([{name:'Use Search Bar..'}]);
  const [pointsList, setPointsList] = React.useState([{name:'Use Search Bar..'}]);
  const [groupsList, setGroupsList] = React.useState([{name:'Use Search Bar..'}]);
  const [devicesList, setDevicesList] = React.useState([{name:'Use Search Bar..'}]);
  const [clientsList, setClientsList] = React.useState([{name:'Use Search Bar..'}]);
  const [pageFilter, setFilter] = React.useState("")

  document.addEventListener('copy', function(e) {
    if (PointListDisplayRef.state.show) {
      e.clipboardData.setData('text/plain', JSON.stringify(pointsList));
    } else if (DeviceListDisplayRef.state.show) {
      e.clipboardData.setData('text/plain', JSON.stringify(devicesList));
    } else if (TopicListDisplayRef.state.show) {
      e.clipboardData.setData('text/plain', JSON.stringify(topicsList));
    } else if (GroupListDisplayRef.state.show) {
      e.clipboardData.setData('text/plain', JSON.stringify(groupsList));
    }
    else if (ClientListDisplayRef.state.show) {
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
                <Button onClick={(ref) => {}}

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
                                PointListDisplayRef.current.setShow(true);
                                GroupListDisplayRef.current.setShow(false);
                                DeviceListDisplayRef.current.setShow(false);
                                TopicListDisplayRef.current.setShow(false);
                                ClientListDisplayRef.current.setShow(false);
                                setAddButtonShow("visible");
                              }}
                            >
                              Points
                            </Card.Body>
                          </Accordion.Collapse>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body
                              onClick={() => {
                                PointListDisplayRef.current.setShow(false);
                                GroupListDisplayRef.current.setShow(false);
                                DeviceListDisplayRef.current.setShow(true);
                                TopicListDisplayRef.current.setShow(false);
                                ClientListDisplayRef.current.setShow(false);
                                setAddButtonShow("visible");
                              }}
                            >
                              Devices
                            </Card.Body>
                          </Accordion.Collapse>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body
                              onClick={() => {
                                PointListDisplayRef.current.setShow(false);
                                GroupListDisplayRef.current.setShow(false);
                                DeviceListDisplayRef.current.setShow(false);
                                TopicListDisplayRef.current.setShow(false);
                                ClientListDisplayRef.current.setShow(true);
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
                                PointListDisplayRef.current.setShow(false);
                                GroupListDisplayRef.current.setShow(false);
                                DeviceListDisplayRef.current.setShow(false);
                                TopicListDisplayRef.current.setShow(true);
                                ClientListDisplayRef.current.setShow(false);
                                setAddButtonShow("hidden");
                              }}
                            >
                              Topics
                            </Card.Body>
                          </Accordion.Collapse>
                          <Accordion.Collapse eventKey="1">
                            <Card.Body
                              onClick={() => {
                                PointListDisplayRef.current.setShow(false);
                                GroupListDisplayRef.current.setShow(true);
                                DeviceListDisplayRef.current.setShow(false);
                                TopicListDisplayRef.current.setShow(false);
                                ClientListDisplayRef.current.setShow(false);
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
                        <PointListComponent
                          objectlist={pointsList}
                          ref={PointListDisplayRef}/>
                        <GroupListComponent
                          objectlist={groupsList}
                          ref={GroupListDisplayRef}/>
                        <DeviceListComponent
                          objectlist={devicesList}
                          ref={DeviceListDisplayRef}/>
                        <TopicListComponent
                          objectlist={topicsList}
                          ref={TopicListDisplayRef}/>
                        <ClientListComponent
                          objectlist={clientsList}
                          ref={ClientListDisplayRef}/>
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
                    if (ref.key === 'Enter') {
                      if (TopicListDisplayRef.current.state.show === true) {
                        setProgress("Loading Topics...");
                        getTopicList("topics", ref.target.value, setTopicsList, setProgress)
                      }
                      if (PointListDisplayRef.current.state.show === true) {
                        setProgress("Loading Points...");
                        getTopicList("points", ref.target.value, setPointsList, setProgress)
                      }
                      if (GroupListDisplayRef.current.state.show === true) {
                        setProgress("Loading Groups...");
                        getTopicList("groups", ref.target.value, setGroupsList, setProgress)
                      }
                      if (DeviceListDisplayRef.current.state.show ===true) {
                        setProgress("Loading Devices...");
                        getTopicList("devices", ref.target.value, setDevicesList, setProgress)
                      }
                      if (ClientListDisplayRef.current.state.show === true) {
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
