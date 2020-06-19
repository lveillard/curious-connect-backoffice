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

import JsonViewer from "../components/jsonViewer";

import { useGlobal } from "../store";

const EmailVerifier = () => {
  const [globalState, globalActions] = useGlobal();

  const [mails, setMails] = useState("l.veillard@gmail.com");
  const [answers, setAnswers] = useState("");

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

                              let verificationArray = await Promise.all(
                                mails.split(",").map(
                                  async (x, index) => {
                                    try {
                                      //await timeout(2000);
                                      let answer = await globalActions.server.GET(
                                        "/test",
                                        {
                                          mail: x.trim(),
                                          id: index,
                                        }
                                      );

                                      if (answer.res.data.type === "success") {
                                        const result = {
                                          result: answer.res.data.info.success,
                                          mail: answer.res.data.mail,
                                          code: answer.res.data.info.code,
                                          second: answer.res.data.extra.success,
                                          type: "success",
                                          id: answer.res.data.id,
                                        };
                                        console.log("result", result);

                                        //functional update!
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
