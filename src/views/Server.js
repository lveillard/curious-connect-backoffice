import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Container,
  Badge,
  Row,
  Col,
} from "reactstrap";

import { SERVER_URL } from "../utils/constants";

import JsonViewer from "../components/Common/JsonViewer";

import { Input, ControlLabel, Checkbox } from "rsuite";

import { UncontrolledTooltip, Tooltip } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import Select from "react-select";

import "../assets/css/emailing.css";

//steps:
// 1) Copy template
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the code server curious-connect-server.herokuapp.com
// 4) grant the route permission to somebody in the mongodb

const Server = () => {
  const [globalState, globalActions] = useGlobal();
  const [url, setUrl] = useState("/users/me");

  const [payload, setPayload] = useState({
    active: false,
    data: {
      mail: "l.veillard@gmail.com",
      token: "AQ...",
      filterUrl: "https://www.linkedin.com/sales....",
      fileName: "result.json",
      linkedinUrl: "https://www.linkedin.com/in/loic-veillard/",
    },
  });
  const [reqMode, setReqMode] = useState({ value: "GET", label: "GET" });
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    // check server status
    async function checkServers() {
      const server = await globalActions.server.isAvailable(false);
      const local = await globalActions.server.isAvailable(true);
    }
    checkServers();
  }, []);

  return (
    <>
      <div className="bg-gradient-danger" style={{ height: "200px" }}>
        {" "}
      </div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="6">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Server Status </h3>
                    <Badge
                      style={{
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        verticalAlign: "bottom",
                      }}
                      color=""
                      className="badge-dot mr-4"
                    >
                      <b>MAIN</b>
                      <i
                        style={{
                          verticalAlign: "inherit",
                          width: "0.8rem",
                          height: "0.8rem",
                          marginLeft: "3px",
                          marginRight: "0px",
                        }}
                        className={
                          globalState.server.status.server === true
                            ? "bg-success"
                            : "bg-danger"
                        }
                      />{" "}
                      {globalState.server.status.server === true
                        ? "Running"
                        : "Stopped"}
                    </Badge>
                    <Badge
                      style={{
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        verticalAlign: "bottom",
                      }}
                      color=""
                      className="badge-dot mr-4"
                    >
                      <b>LOCAL</b>
                      <i
                        style={{
                          verticalAlign: "inherit",
                          width: "0.8rem",
                          height: "0.8rem",
                          marginLeft: "3px",
                          marginRight: "0px",
                        }}
                        className={
                          globalState.server.status.local === true
                            ? "bg-success"
                            : "bg-danger"
                        }
                      />{" "}
                      {globalState.server.status.local === true
                        ? "Running"
                        : "Stopped"}
                    </Badge>
                  </Col>

                  <Col className="text-right" xs="6">
                    <FormGroup>
                      {" "}
                      <Button
                        color="primary"
                        onClick={async (e) => {
                          const server = await globalActions.server.isAvailable(
                            false
                          );
                          const local = await globalActions.server.isAvailable(
                            true
                          );
                        }}
                        size="sm"
                      >
                        Refresh
                      </Button>{" "}
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xl="12">
                    <h6 className="heading-small text-muted">
                      Server requests
                    </h6>

                    <Form className="mt-3">
                      <FormGroup>
                        <ControlLabel className="form-control-label">
                          Mode
                        </ControlLabel>
                        <Select
                          className="selector"
                          classNamePrefix="select"
                          isDisabled={false}
                          isLoading={false}
                          value={reqMode}
                          isClearable
                          isSearchable
                          onChange={(selected, type) => {
                            setReqMode(selected);
                          }}
                          options={[
                            { value: "GET", label: "GET" },
                            { value: "POST", label: "POST" },
                          ]}
                        />
                      </FormGroup>
                      <FormGroup>
                        <ControlLabel className="form-control-label">
                          Request url
                        </ControlLabel>
                        <Input
                          value={url}
                          onChange={(value, event) => {
                            setUrl(value);
                          }}
                          name="message"
                          style={{ resize: "auto" }}
                          rows={10}
                        />
                        {reqMode.value === "GET" && (
                          <Checkbox
                            checked={payload.active}
                            onChange={(e, v) => {
                              setPayload({
                                data: payload.data,
                                active: !payload.active,
                              });
                            }}
                          >
                            {" "}
                            Add parameters
                          </Checkbox>
                        )}
                      </FormGroup>

                      {(reqMode.value === "POST" ||
                        payload.active === true) && (
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Params
                          </ControlLabel>

                          <JsonViewer
                            name="Params"
                            src={payload.data}
                            permissions={{
                              edit: true,
                              add: true,
                              delete: true,
                              copy: false,
                            }}
                            onChangeJSON={(e) =>
                              setPayload({
                                data: e.updated_src,
                                active: payload.active,
                              })
                            }
                          />
                        </FormGroup>
                      )}

                      {answer && (
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Answer
                          </ControlLabel>{" "}
                          <JsonViewer
                            type="answer"
                            name={answer.type}
                            src={answer}
                            collapsed={true}
                            permissions={{ copy: true }}
                          />
                        </FormGroup>
                      )}

                      {false && (
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Answer
                          </ControlLabel>
                          <Input
                            style={{
                              resize: "vertical",
                              color:
                                answer.type === "error"
                                  ? "#f5365c"
                                  : answer.res === "loading..."
                                  ? "#ffd600"
                                  : "#2dce89",
                            }}
                            value={JSON.stringify(
                              //answer.res.data ? answer.res.data : answer.res
                              answer
                            )}
                            componentClass="textarea"
                            rows={10}
                          />
                        </FormGroup>
                      )}

                      <FormGroup>
                        <Button
                          color="primary"
                          className="float-right"
                          onClick={async (e) => {
                            try {
                              setAnswer({ type: "loading..." });
                              setAnswer(
                                reqMode.value === "GET"
                                  ? await globalActions.server.GET(
                                      url,
                                      payload.data
                                    )
                                  : await globalActions.server.POST(
                                      url,
                                      payload.data
                                    )
                              );
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                        >
                          Send Message
                        </Button>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  {" "}
                  <h6 className="heading-small text-muted">Result</h6>
                </Row>
                <div> {JSON.stringify(answer)} </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Server;
