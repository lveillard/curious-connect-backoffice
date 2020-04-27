import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Container,
  Form,
  ButtonGroup,
  Label,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Progress,
  UncontrolledDropdown,
  UncontrolledTooltip,
  Media,
  Badge,
} from "reactstrap";

import { Checkbox } from "rsuite";

import Select from "react-select";

import EmailHeader from "components/Headers/EmailHeader.js";

import { gapi } from "gapi-script";

import { Input, ControlLabel } from "rsuite";

import { useGlobal } from "../store";

import MIMEText from "mimetext";

import { RiMailSendLine } from "react-icons/ri";

import "../assets/css/bulk-emailing.css";

const BulkEmail = (props) => {
  const [globalState, globalActions] = useGlobal();

  const [student, setStudent] = useGlobal();

  const dict = {
    Sent: "bg-success",
    Sending: "bg-warning",
    Ready: "bg-info",
    Error: "bg-danger",
  };

  useEffect(() => {
    console.log(globalState);
    //get list of students
    globalActions.airtable.getStudents();
  }, []);

  return (
    <>
      <EmailHeader />

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a
                      href={
                        globalState.currentStudent &&
                        globalState.currentStudent.files[0].url
                      }
                      download="hello"
                      onClick={(e) => {
                        e.preventDefault();

                        globalState.currentStudent &&
                          window.open(globalState.currentStudent.files[0].url);
                      }}
                    >
                      <img
                        style={
                          globalState.currentStudent && {
                            marginTop: "135px",
                            clip: "rect(0px,250px,77px,0px)",
                            maxWidth: "250px",
                            width: "250px",
                          }
                        }
                        width="170px"
                        alt="..."
                        className={
                          !globalState.currentStudent ? "rounded-circle" : "meh"
                        }
                        src={
                          (globalState.currentStudent &&
                            globalState.currentStudent.files[0].thumbnails.large
                              .url) ||
                          "https://www.brandeps.com/logo-download/A/Airtable-logo-vector-01.svg"
                        }
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0">
                <div className="d-flex justify-content-between">
                  <div></div>
                  <Button
                    className="float-right"
                    style={{
                      marginTop: "14px",
                    }}
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      globalActions.airtable.getStudents();
                    }}
                    size="sm"
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-2">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      {globalState.currentStudent && (
                        <>
                          <div>
                            <span className="heading">100</span>
                            <span className="description">Sent</span>
                          </div>
                          <div>
                            <span className="heading">80</span>
                            <span className="description">Companies</span>
                          </div>
                          <div>
                            <span className="heading">5</span>
                            <span className="description">Bounced</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Row>

                <div className="mb-3">
                  <Select
                    className="selector"
                    classNamePrefix="select"
                    isDisabled={globalState.isLoading.airtable}
                    isLoading={globalState.isLoading.airtable}
                    isClearable
                    isSearchable
                    onChange={(selected, type) => {
                      globalActions.routes.setCurrentStudent(selected);
                      if (type.action === "clear")
                        globalActions.routes.setCurrentStudent(null);
                    }}
                    value={globalState.selectedStudent}
                    options={
                      globalState.students &&
                      globalState.students.map((x) => {
                        return {
                          value: x.emailSender,
                          label: x.name + " " + x.familyName,
                        };
                      })
                    }
                  />
                </div>
                {globalState.currentStudent && (
                  <div className="text-center">
                    <h3>
                      {globalState.selectedStudent.label}
                      <span className="h5 font-weight-light">
                        {" (" + globalState.currentStudent.age + ")"}
                      </span>
                    </h3>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      Region
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      {globalState.currentStudent.formation}
                    </div>
                    <div>
                      <i className="ni education_hat mr-2" />
                      {globalState.currentStudent.school}
                    </div>
                    <hr className="my-4" />

                    <div
                      style={{
                        whiteSpace: "pre-line",
                        textAlign: "justify",
                      }}
                    >
                      {globalState.currentStudent.emailContent}
                    </div>
                    <p> ------------------- </p>
                    <p>{globalState.currentStudent.emailSignature}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Row>
              <div className="col">
                <Card className="bg-default shadow">
                  <CardHeader className="bg-transparent d-flex border-0">
                    <Col xs="5">
                      <h3 className="text-white mb-0">Bulk email</h3>
                      <h6 className="text-white mb-0">All senders</h6>
                    </Col>
                    <Col
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                      className="text-right"
                      xs="7"
                    >
                      <ButtonGroup>
                        <Button
                          className="float-right"
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            globalActions.airtable.getReadyToSendEmails();
                          }}
                          size="sm"
                        >
                          Refresh
                        </Button>

                        {globalState.gapiAuthed && (
                          <Button
                            className="float-right"
                            color="danger"
                            onClick={(e) => {
                              e.preventDefault();
                              globalActions.mailing.checkSenders();
                            }}
                            size="sm"
                          >
                            Check senders
                          </Button>
                        )}

                        {globalState.gapiAuthed && (
                          <Button
                            className="float-right"
                            color="warning"
                            onClick={(e) => {
                              e.preventDefault();
                              globalActions.mailing.checkSenders();
                            }}
                            size="sm"
                          >
                            SEND
                          </Button>
                        )}
                      </ButtonGroup>
                    </Col>
                  </CardHeader>
                  <Table
                    className="align-items-center table-dark table-flush"
                    responsive
                  >
                    <thead className="thead-dark">
                      <tr>
                        <th
                          scope="col"
                          style={{
                            width: "10px",
                          }}
                        >
                          <Checkbox
                            onChange={(e, v) =>
                              globalActions.mailing.selectAllReadyToSendEmail(v)
                            }
                          ></Checkbox>
                        </th>
                        <th scope="col">Company</th>
                        <th scope="col">Addresses</th>
                        <th scope="col">Status</th>
                        <th
                          scope="col"
                          style={{
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            width: "10px",
                          }}
                        />
                        <th
                          scope="col"
                          style={{ paddingLeft: "0px", paddingRight: "0px" }}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.readyToSendRecords &&
                        globalState.readyToSendRecords.map((x, key) => (
                          <tr key={key} className="fina">
                            <th scope="row">
                              <Checkbox
                                checked={x.isSelected}
                                onChange={(e) =>
                                  globalActions.mailing.selectReadyToSendEmail(
                                    x.id
                                  )
                                }
                              />
                            </th>
                            <th scope="row"> {x.company}</th>
                            <td>
                              <div>
                                <b> {"From: "}</b>{" "}
                                <i style={{ color: "rgb(204, 120, 214)" }}>
                                  {" "}
                                  {x.senderAddress}{" "}
                                </i>
                              </div>
                              <div>
                                <b> {"To: "}</b>{" "}
                                <i style={{ color: "rgb(255, 252, 160)" }}>
                                  {x.targetAddress}{" "}
                                </i>
                              </div>
                            </td>
                            <td>
                              <Badge color="" className="badge-dot mr-4">
                                <i className={dict[x.status]} />
                                {x.status}
                              </Badge>
                            </td>
                            <td
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                              }}
                            >
                              {globalState.gapiAuthed && x.status === "Ready" && (
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-center raise"
                                >
                                  <RiMailSendLine />{" "}
                                  <div
                                    style={{
                                      fontSize: "0.6rem",
                                    }}
                                  >
                                    {" "}
                                    Send{" "}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                                width: "10px",
                              }}
                            >
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-arrow"
                                  right
                                >
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Action
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Another action
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Something else here
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BulkEmail;
