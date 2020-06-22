import React, { useEffect, useState } from "react";
import { ControlLabel } from "rsuite";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

import JsonViewer from "../components/Common/JsonViewer";
import RTable from "../components/Common/RTable";

import { useGlobal } from "../store";

// table

import styled from "styled-components";

import "../assets/css/emailing.css";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const EmailVerifier = () => {
  const [globalState, globalActions] = useGlobal();

  const [mails, setMails] = useState("l.veillard@gmail.com");
  const [answers, setAnswers] = useState("");

  const [data, setData] = React.useState(() => []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id", // accessor is the "key" in the data
      },
      {
        Header: "Email",
        accessor: "mail",
      },
      {
        id: "Main",
        Header: "MainCheck",
        accessor: (c) => c.main.toString(),
      },
      {
        id: "Secondary",
        Header: "SecCheck",
        accessor: (c) => c.sec.toString(),
      },
    ],
    []
  );

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div className="bg-gradient-primary" style={{ height: "200px" }}>
        {" "}
      </div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1 mb-5" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Verify Email</h3>
                  </Col>
                  <Col className="text-right" xs="8">
                    {/*<FormGroup>
                      <Button
                        color="primary"
                        onClick={async (e) => {}}
                        size="sm"
                      >
                        Verify
                      </Button>{" "}
                    </FormGroup>*/}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted">Target email</h6>

                  <div className="pl-lg-4">
                    <Row>
                      <Col>
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            Emails list
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            type="textarea"
                            value={mails}
                            onChange={(e) => setMails(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="pull-right mt-4">
                          <Button
                            color="primary"
                            onClick={async () => {
                              setAnswers([]);
                              setData([]);

                              // eslint-disable-next-line no-unused-vars
                              let verificationArray = await Promise.all(
                                mails.split(",").map(
                                  async (x, index) => {
                                    try {
                                      //await timeout(2000);
                                      let answer = await globalActions.server.GET(
                                        "/verifyEmail",
                                        {
                                          mail: x.trim(),
                                          id: index,
                                        }
                                      );

                                      if (answer.res.data.type === "success") {
                                        const result = {
                                          result: {
                                            main: answer.res.data.info.success,
                                            secondary:
                                              answer.res.data.extra.success,
                                          },
                                          mail: answer.res.data.mail,
                                          code: answer.res.data.info.code,
                                          type: "success",
                                          id: answer.res.data.id,
                                        };
                                        console.log("result", result);

                                        //functional updates!
                                        answer.res.data &&
                                          setData((data) =>
                                            data.concat({
                                              id: answer.res.data.id,
                                              mail: answer.res.data.mail,
                                              main:
                                                answer.res.data.info.success,
                                              sec:
                                                answer.res.data.extra.success,
                                            })
                                          );

                                        answer.res.data &&
                                          setAnswers((answers) =>
                                            answers.concat(result)
                                          );
                                      } else {
                                        setAnswers((answers) =>
                                          answers.concat({
                                            type: "error",
                                            message: answer.res.data.message,
                                            result: "probable bounce",
                                            mail: answer.res.data.mail,
                                            id: answer.res.data.id,
                                            answe: answer,
                                          })
                                        );
                                      }
                                    } catch (err) {
                                      console.log("Error", err);
                                      //setIsLoading(false);
                                    }
                                  }

                                  //setIsLoading(false);
                                )
                              );
                            }}
                          >
                            {`Verify  (${
                              mails.split(",").length
                            } email addresses)`}
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {answers.length === 1 && (
                          <FormGroup>
                            <ControlLabel className="form-control-label">
                              Answer
                            </ControlLabel>{" "}
                            <JsonViewer
                              type="answer"
                              name={answers[0].type}
                              src={answers[0]}
                              collapsed={true}
                              permissions={{ copy: true }}
                            />
                          </FormGroup>
                        )}

                        {answers.length > 1 && (
                          <FormGroup>
                            <ControlLabel className="form-control-label">
                              Answers ({answers.length} answers)
                            </ControlLabel>{" "}
                            <JsonViewer
                              name="answers"
                              permissions={{ copy: true }}
                              src={answers}
                              collapsed={true}
                            />
                          </FormGroup>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col>
                        <RTable
                          data={data}
                          setData={setData}
                          columns={columns}
                        />
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmailVerifier;
