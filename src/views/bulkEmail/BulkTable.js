import React, { useEffect, useState } from "react";

import { useGlobal } from "../../store";

import { RiMailSendLine } from "react-icons/ri";
import { MdQueryBuilder, MdDoneAll } from "react-icons/md";

import BulkViewSelector from "./BulkViewSelector";
import {
  Row,
  Col,
  Card,
  CardFooter,
  CardHeader,
  Button,
  ButtonGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  PaginationLink,
  PaginationItem,
  Pagination,
  UncontrolledDropdown,
  Badge,
} from "reactstrap";

import { Loader, Checkbox, Whisper, Tooltip } from "rsuite";

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

const BulkTable = () => {
  const [globalState, globalActions] = useGlobal();

  const isSomethingLoading = () => {
    if (
      globalState.isLoading.readyToSendRecords ||
      globalState.isLoading.sentRecords ||
      globalState.isLoading.bounceChecker
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isEmptyTable = () => {
    if (
      globalState[dictArrays[globalState.subView.bulkEmail]] &&
      globalState[dictArrays[globalState.subView.bulkEmail]].length < 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  useEffect(() => {
    /*async function fetchMyAPI() {
    }*/
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Card
            style={{
              background: "transparent",
              borderTop: "0px",
            }}
          >
            {/* view selector */}
            <BulkViewSelector />

            {/* Card header */}
            <CardHeader
              style={{
                marginRight: "1px",
                background: "#152849",

                // background: globalState.subView.bulkEmail==="readyToSend" ? "#152849" : "#172d52",
              }}
              className=" d-flex border-0"
            >
              <Col xs="4">
                <h3 className="text-white mb-0">Bulk email</h3>
                <h6 className="text-white mb-0">
                  {globalState.bulkSender.selectedStudent
                    ? "Sender: " + globalState.bulkSender.selectedStudent.label
                    : "All senders"}
                </h6>
              </Col>
              <Col
                xs="8"
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginRight: "0px",
                  marginLeft: "auto",
                }}
                className="text-right"
              >
                <ButtonGroup>
                  <Button
                    className="float-right"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      globalState.subView.bulkEmail === "readyToSend" &&
                        globalActions.airtable.getReadyToSendEmails();
                      globalState.subView.bulkEmail === "sent" &&
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
                          display: "flex",
                          alignItems: "center",
                        }}
                        color="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          globalActions.mailing.checkAllBounced();
                        }}
                        size="sm"
                      >
                        {globalState.isLoading.bounceChecker ? (
                          <>
                            <Loader
                              style={{
                                padding: "0px",
                                margin: "0px",
                                color: "white",
                              }}
                            />

                            <div className="ml-2">
                              {"Checking... " +
                                globalState.isProcessing.bounceChecker.current +
                                "/" +
                                globalState.isProcessing.bounceChecker
                                  .total}{" "}
                            </div>
                          </>
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
                          display: "flex",
                          alignItems: "center",
                        }}
                        color="warning"
                        onClick={(e) => {
                          e.preventDefault();
                          globalActions.mailing.sendEmailsBulk();
                        }}
                        size="sm"
                      >
                        {globalState.isLoading.bulkSender ? (
                          <>
                            <Loader
                              style={{
                                padding: "0px",
                                margin: "0px",
                                color: "white",
                              }}
                            />

                            <div className="ml-2">
                              {"Sending... " +
                                globalState.isProcessing.bulkSender.current +
                                "/" +
                                globalState.isProcessing.bulkSender.total}{" "}
                            </div>
                          </>
                        ) : (
                          <div style={{ fontWeight: "700" }}>Send'em!</div>
                        )}
                      </Button>
                    )}
                </ButtonGroup>
              </Col>
            </CardHeader>

            {/* Table */}
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
                          globalActions.mailing.selectAllReadyToSendEmail(v);
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
                {
                  // If loading or empty
                  isSomethingLoading() || isEmptyTable() ? (
                    <tr className="fina">
                      <td style={{ textAlign: "center" }} colSpan={4}>
                        {isSomethingLoading() ? (
                          <b> Loading...</b>
                        ) : (
                          "No pending emails: Try to refresh, change sender or add messages in Airtable "
                        )}
                      </td>
                    </tr>
                  ) : (
                    // Not loading AND not empty
                    paginate(
                      // we get the good array depending on the subview
                      globalState[dictArrays[globalState.subView.bulkEmail]],
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
                        <th scope="row">
                          {" "}
                          {x.company.length < 25
                            ? x.company
                            : x.company.slice(0, 24) + "..."}
                        </th>
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
                            style={x.errorMessage && { cursor: "pointer" }}
                            placement="right"
                            trigger="hover"
                            speaker={
                              <Tooltip
                                style={
                                  !x.errorMessage ? { display: "none" } : null
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
                                  console.log(
                                    globalActions.mailing.checkBounced(x)
                                  );
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
                          {globalState.gapiAuthed && x.status === "Ready" && (
                            <div
                              style={{ cursor: "pointer" }}
                              className="text-center raise"
                              onClick={async () => {
                                globalActions.mailing.setRecordProperty(x.id, {
                                  status: "Sending",
                                });
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
                              href="#"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
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
                  )
                }
              </tbody>
            </Table>

            {/* Pagination */}
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
        </Col>
      </Row>
    </>
  );
};

export default BulkTable;
