import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

import { SERVER_URL } from "../utils/constants";

import { Input, ControlLabel, Checkbox } from "rsuite";

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
  const [local, setLocal] = useState(false);
  const [reqMode, setReqMode] = useState({ value: "GET", label: "GET" });
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
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
                    <h3 className="mb-0">Server Status</h3>
                    <Checkbox
                      checked={local}
                      onChange={(e, v) => {
                        setLocal(v);
                      }}
                    >
                      {" "}
                      Local
                    </Checkbox>
                  </Col>

                  <Col className="text-right" xs="6">
                    <FormGroup>
                      {" "}
                      <Button color="primary" onClick={(e) => {}} size="sm">
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
                      </FormGroup>

                      {reqMode.value === "POST" && (
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            params
                          </ControlLabel>
                          <Input
                            style={{
                              width: "100%",
                              resize: "vertical",
                            }}
                            value={url}
                            onChange={(value, event) => {
                              setUrl(value);
                            }}
                            name="message"
                            componentClass="textarea"
                            rows={5}
                          />
                        </FormGroup>
                      )}

                      {answer && (
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Answer
                          </ControlLabel>
                          <Input
                            style={{
                              resize: "vertical",
                              color:
                                answer.type === "error" ? "#f5365c" : "#2dce89",
                            }}
                            value={JSON.stringify(
                              answer.res.data ? answer.res.data : answer.res
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
                              setAnswer(
                                await globalActions.server.GET(url, local)
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
                  <h6 className="heading-small text-muted">Target data</h6>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Server;
