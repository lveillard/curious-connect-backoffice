import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  CardFooter,
  CardHeader,
  CardBody,
  Button,
  Container,
  ButtonGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  PaginationLink,
  PaginationItem,
  Pagination,
  NavItem,
  NavLink,
  Nav,
  UncontrolledDropdown,
  Badge,
} from "reactstrap";

import { Loader, Checkbox, Whisper, Tooltip } from "rsuite";

import Select from "react-select";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import { RiMailSendLine } from "react-icons/ri";
import { MdQueryBuilder, MdDoneAll } from "react-icons/md";

import "../assets/css/bulk-emailing.css";

const BulkEmail = (props) => {
  const [globalState, globalActions] = useGlobal();

  function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  const dictStatus = {
    Sent: "bg-success",
    Sending: "bg-warning",
    Checking: "bg-warning",
    Ready: "bg-info",
    Error: "bg-danger",
    Loaded: "bg-primary",
    Bounced: "bg-danger",
    Limits: "bg-orange",
  };

  const dictArrays = {
    sent: "sentRecords",
    readyToSend: "readyToSendRecords",
  };

  useEffect(() => {
    //get list of students
    globalActions.airtable.getStudents();
    globalActions.airtable.getReadyToSendEmails();
    //globalActions.airtable.getSentEmails();
    console.log("state", globalState);
  }, [globalState.bulkSender.selectedStudent, globalState.currentProgram]);

  return (
    <>
      <EmailHeader />

      {globalState.gapiAuthed && (
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a
                        href={
                          globalState.bulkSender.currentStudent &&
                          globalState.bulkSender.currentStudent.files[0].url
                        }
                        download="hello"
                        onClick={(e) => {
                          e.preventDefault();

                          globalState.bulkSender.currentStudent &&
                            window.open(
                              globalState.bulkSender.currentStudent.files[0].url
                            );
                        }}
                      >
                        <img
                          style={
                            globalState.bulkSender.currentStudent && {
                              marginTop: "135px",
                              clip: "rect(0px,250px,77px,0px)",
                              maxWidth: "250px",
                              width: "250px",
                            }
                          }
                          width="170px"
                          alt="..."
                          className={
                            !globalState.bulkSender.currentStudent
                              ? "rounded-circle"
                              : "meh"
                          }
                          src={
                            (globalState.bulkSender.currentStudent &&
                              globalState.bulkSender.currentStudent.files[0]
                                .thumbnails.large.url) ||
                            "https://seeklogo.com/images/A/airtable-logo-216B9AF035-seeklogo.com.png"
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
                        {globalState.isLoading.sentRecords &&
                          "Loading stats..."}

                        {globalState.sentRecords &&
                          !globalState.isLoading.sentRecords && (
                            <>
                              <div>
                                <span className="heading">
                                  {globalState.sentMetrics.sentCount}
                                </span>
                                <span className="description">Sent</span>
                              </div>
                              <div>
                                <span className="heading">
                                  {globalState.sentMetrics.companies}
                                </span>
                                <span className="description">Companies</span>
                              </div>
                              <div>
                                <span className="heading">
                                  {globalState.sentMetrics.limits}
                                </span>
                                <span className="description">limits</span>
                              </div>

                              <div>
                                <span className="heading">
                                  {globalState.sentMetrics.bounced}
                                </span>
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
                        globalActions.bulkSender.setCurrentStudent(selected);
                        if (type.action === "clear")
                          globalActions.bulkSender.setCurrentStudent(null);
                      }}
                      value={globalState.bulkSender.selectedStudent}
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
                  {globalState.bulkSender.currentStudent && (
                    <div className="text-center">
                      <h3>
                        {globalState.bulkSender.selectedStudent.label}
                        <span className="h5 font-weight-light">
                          {" (" +
                            globalState.bulkSender.currentStudent.age +
                            ")"}
                        </span>
                      </h3>
                      <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2" />
                        Region
                      </div>
                      <div className="h5 mt-4">
                        <i className="ni business_briefcase-24 mr-2" />
                        {globalState.bulkSender.currentStudent.formation}
                      </div>
                      <div>
                        <i className="ni education_hat mr-2" />
                        {globalState.bulkSender.currentStudent.school}
                      </div>
                      <hr className="my-4" />

                      <div
                        style={{
                          whiteSpace: "pre-line",
                          textAlign: "justify",
                        }}
                      >
                        {globalState.bulkSender.currentStudent.emailContent}
                      </div>
                      <p> ------------------- </p>
                      <p>
                        {globalState.bulkSender.currentStudent.emailSignature}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col className="order-xl-1" xl="8">
              <Row>
                <div className="col">
                  <Card
                    style={{
                      background: "transparent",
                      borderTop: "0px",
                    }}
                  >
                    <Nav tabs syle={{ background: "transparent" }}>
                      <NavItem
                        style={{
                          background:
                            globalState.subView.bulkEmail === "readyToSend"
                              ? "#152849"
                              : "#172d52",
                          borderTopRightRadius: "6px",
                          borderTopLeftRadius: "6px",
                          width: "50%",
                          textAlign: "center",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        <NavLink
                          style={{ height: "48px" }}
                          onClick={() => {
                            globalActions.config.setSubView(
                              "bulkEmail",
                              "readyToSend"
                            );
                          }}
                        >
                          <div
                            style={{
                              color:
                                !(
                                  globalState.subView.bulkEmail ===
                                  "readyToSend"
                                ) && "#ccc",
                              fontSize:
                                globalState.subView.bulkEmail ===
                                  "readyToSend" && "18px",
                              fontWeight:
                                !(
                                  globalState.subView.bulkEmail ===
                                  "readyToSend"
                                ) && "100",
                              transitionDuration: "0.3s",
                              paddingTop: "6px",
                            }}
                          >
                            <MdQueryBuilder
                              style={{
                                color: "#ffd600",
                                marginBottom: "2px",
                                marginRight: "1px",
                              }}
                            />{" "}
                            To send
                          </div>
                        </NavLink>
                      </NavItem>
                      <NavItem
                        style={{
                          background:
                            globalState.subView.bulkEmail === "sent"
                              ? "#152849"
                              : "#172d52",
                          borderRight: "solid 1px #5e72e4",
                          borderTopRightRadius: "6px",
                          borderTopLeftRadius: "6px",
                          width: "50%",
                          textAlign: "center",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        <NavLink
                          style={{ height: "48px" }}
                          onClick={() => {
                            globalActions.config.setSubView(
                              "bulkEmail",
                              "sent"
                            );
                          }}
                        >
                          <div
                            style={{
                              color:
                                !(globalState.subView.bulkEmail === "sent") &&
                                "#ccc",
                              fontSize:
                                globalState.subView.bulkEmail === "sent" &&
                                "18px",
                              fontWeight:
                                !(globalState.subView.bulkEmail === "sent") &&
                                "100",
                              transitionDuration: "0.3s",
                              paddingTop: "6px",
                            }}
                          >
                            {" "}
                            <MdDoneAll
                              style={{
                                color: "#2dce89",
                                marginBottom: "2px",
                                marginRight: "1px",
                              }}
                            />{" "}
                            Sent
                          </div>
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <CardHeader
                      style={{
                        marginRight: "1px",
                        background: "#152849",

                        // background: globalState.subView.bulkEmail==="readyToSend" ? "#152849" : "#172d52",
                      }}
                      className=" d-flex border-0"
                    >
                      <Col xs="5">
                        <h3 className="text-white mb-0">Bulk email</h3>
                        <h6 className="text-white mb-0">
                          {globalState.bulkSender.selectedStudent
                            ? "Sender: " +
                              globalState.bulkSender.selectedStudent.label
                            : "All senders"}
                        </h6>
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
                              globalActions.airtable.getSentEmails();
                            }}
                            size="sm"
                          >
                            Refresh
                          </Button>

                          {globalState.gapiAuthed &&
                            globalState.subView.bulkEmail === "readyToSend" &&
                            globalState.readyToSendRecords &&
                            globalState.readyToSendRecords.length > 0 && (
                              <Button
                                className="float-right"
                                color="danger"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  await globalActions.mailing.checkSenders();
                                }}
                                size="sm"
                              >
                                Check senders
                              </Button>
                            )}

                          {globalState.gapiAuthed &&
                            globalState.subView.bulkEmail === "sent" &&
                            globalState.sentRecords &&
                            globalState.sentRecords.length > 0 && (
                              <Button
                                className="float-right"
                                disabled={globalState.isLoading.bounceChecker}
                                style={{
                                  paddingTop: "0px",
                                  paddingBottom: "0px",
                                }}
                                color="danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  globalActions.mailing.checkAllBounced();
                                }}
                                size="sm"
                              >
                                {globalState.isLoading.bounceChecker ? (
                                  <Loader
                                    style={{
                                      padding: "0px",
                                      margin: "0px",
                                      color: "white",
                                    }}
                                    content="Checking..."
                                  />
                                ) : (
                                  "Check bounced"
                                )}
                              </Button>
                            )}

                          {globalState.gapiAuthed &&
                            globalState.subView.bulkEmail === "readyToSend" &&
                            globalState.readyToSendConfig.atLeastOneReady && (
                              <Button
                                className="float-right"
                                disabled={globalState.isLoading.bulkSender}
                                style={{
                                  paddingTop: "0px",
                                  paddingBottom: "0px",
                                }}
                                color="warning"
                                onClick={(e) => {
                                  e.preventDefault();
                                  globalActions.mailing.sendEmailsBulk();
                                }}
                                size="sm"
                              >
                                {globalState.isLoading.bulkSender ? (
                                  <Loader
                                    style={{
                                      padding: "0px",
                                      margin: "0px",
                                      color: "white",
                                    }}
                                    content="Sending..."
                                  />
                                ) : (
                                  "SEND"
                                )}
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
                        <tr className="fina">
                          <th
                            scope="col"
                            style={{
                              width: "47px",
                            }}
                          >
                            {globalState.readyToSendConfig.atLeastOneReady && (
                              <Checkbox
                                onChange={(e, v) => {
                                  globalActions.mailing.selectAllReadyToSendEmail(
                                    v
                                  );
                                }}
                              ></Checkbox>
                            )}
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
                        {!(
                          globalState[
                            dictArrays[globalState.subView.bulkEmail]
                          ] &&
                          globalState[dictArrays[globalState.subView.bulkEmail]]
                            .length > 0
                        ) ? (
                          <tr className="fina">
                            <td style={{ textAlign: "center" }} colSpan={4}>
                              {globalState.isLoading.readyToSendRecords ||
                              globalState.isLoading.sentRecords ? (
                                <b> Loading...</b>
                              ) : (
                                "No pending emails: Try to refresh, change sender or add messages in Airtable "
                              )}
                            </td>
                          </tr>
                        ) : (
                          // we get the good array depending on the subview
                          paginate(
                            globalState[
                              dictArrays[globalState.subView.bulkEmail]
                            ],
                            450,
                            1
                          ).map((x, key) => (
                            <tr key={key} className="fina">
                              <th scope="row">
                                {x.status === "Ready" && (
                                  <Checkbox
                                    checked={x.isSelected}
                                    onChange={(e) =>
                                      globalActions.mailing.setPropertyReadyToSendEmail(
                                        x.id,
                                        "isSelected"
                                      )
                                    }
                                  />
                                )}
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
                                <Whisper
                                  style={
                                    x.errorMessage && { cursor: "pointer" }
                                  }
                                  placement="right"
                                  trigger="hover"
                                  speaker={
                                    <Tooltip
                                      style={
                                        !x.errorMessage
                                          ? { display: "none" }
                                          : null
                                      }
                                    >
                                      {x.errorMessage}
                                    </Tooltip>
                                  }
                                >
                                  <Badge
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      x.status === "Sent" &&
                                        globalActions.mailing.checkBounced(x);
                                    }}
                                    color=""
                                    className="badge-dot mr-4"
                                  >
                                    <i className={dictStatus[x.status]} />
                                    {x.status}
                                  </Badge>
                                </Whisper>
                              </td>
                              <td
                                style={{
                                  paddingLeft: "0px",
                                  paddingRight: "0px",
                                }}
                              >
                                {globalState.gapiAuthed &&
                                  x.status === "Ready" && (
                                    <div
                                      style={{ cursor: "pointer" }}
                                      className="text-center raise"
                                      onClick={async () => {
                                        globalActions.mailing.setRecordProperty(
                                          x.id,
                                          {
                                            status: "Sending",
                                          }
                                        );
                                        globalActions.gapi.sendMessage(
                                          await globalActions.mailing.prepareMsg(
                                            x.senderFullName
                                              ? x.senderFullName +
                                                  "<" +
                                                  x.senderAddress +
                                                  ">"
                                              : x.senderAddress,
                                            x.targetAddress,
                                            x.emailObject,
                                            x.emailContent.replace(
                                              /(\r\n|\n|\r)/gm,
                                              "<br>"
                                            ) +
                                              '<div style="color: #777777;">' +
                                              "<br/> <br/>--- <br/>" +
                                              x.senderSignature +
                                              "</div>",
                                            x.emailAttachments
                                          ),
                                          (answer) =>
                                            globalActions.mailing.sendCallback(
                                              answer,
                                              x.id
                                            )
                                        );
                                      }}
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
                          ))
                        )}
                      </tbody>
                    </Table>
                    <CardFooter className="py-4 bg-default">
                      <nav>
                        <Pagination
                          className="pagination justify-content-end mb-0"
                          listClassName="justify-content-end mb-0"
                        >
                          <PaginationItem className="disabled">
                            <PaginationLink
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              tabIndex="-1"
                            >
                              <i className="fas fa-angle-left" />
                              <span className="sr-only">Previous</span>
                            </PaginationLink>
                          </PaginationItem>

                          {[...Array(5).keys()].map((x, key) => (
                            <PaginationItem key={key}>
                              <PaginationLink href="#" onClick={(e) => {}}>
                                {x + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        </Pagination>
                      </nav>
                    </CardFooter>
                  </Card>
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default BulkEmail;
