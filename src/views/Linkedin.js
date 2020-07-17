import React, { useEffect, useState } from "react";

import JsonViewer from "../components/Common/JsonViewer";

import { useGlobal } from "../store";

import { ControlLabel } from "rsuite";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

import "../assets/css/emailing.css";

//steps:
// 1) Copy template
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the code server curious-connect-server.herokuapp.com
// 4) grant the route permission to somebody in the mongodb

const Template = () => {
  const [globalState, globalActions] = useGlobal();
  //const [isEmpty, setIsEmpty] = useState(true);

  const [answers, setAnswers] = useState([]);

  const [linkedinUrl, setLinkedinUrl] = useState(
    "https://www.linkedin.com/in/loic-veillard,https://www.linkedin.com/in/bianca-schor/,https://www.linkedin.com/company/21430/, https://www.linkedin.com/company/2895666/, https://www.linkedin.com/company/2598135/, https://www.linkedin.com/company/10831358/, https://www.linkedin.com/company/973023/"
  );
  const [token, setToken] = useState("AQ...");
  const [isLoading, setIsLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
                    <h3 className="mb-0">Linkedin tools</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <FormGroup>
                      <label className="form-control-label">Token</label>
                      <Input
                        className="form-control-alternative"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                      />{" "}
                    </FormGroup>
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-name"
                      >
                        URL(s)
                      </label>
                      <Input
                        className="form-control-alternative"
                        type="textarea"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </FormGroup>
                    <Col>
                      <FormGroup className="pull-right mt-4">
                        {/*to-do make this button work*/}
                        {isLoading && (
                          <Button
                            disabled={true}
                            onClick={() => {
                              setCancel(true);
                              setIsLoading(false);
                            }}
                            color="danger"
                          >
                            can't cancel
                          </Button>
                        )}
                        {!isLoading && (
                          <Button
                            color="primary"
                            onClick={async () => {
                              // if it is already loading and we click, it means we are cancelling

                              setIsLoading(true);

                              //clean on click
                              //setIsEmpty(true);
                              setAnswers([]);

                              //it's a for as it has to be one by one
                              for (let x of linkedinUrl.split(",")) {
                                //changing isLoading to break will stop the loop
                                console.log("cancel", cancel);
                                if (cancel) {
                                  console.log("request stopped");
                                  setCancel(false);
                                  break;
                                } else
                                  try {
                                    //await timeout(2000);
                                    let answer = await globalActions.server.GET(
                                      "/linkedin",
                                      {
                                        token,
                                        linkedinUrl: x.trim(),
                                      }
                                    );

                                    //functional update!
                                    answer.res.data &&
                                      setAnswers((answers) =>
                                        answers.concat(answer)
                                      );

                                    // as the state is saved in the past, if we only run the else it will get the old answers
                                    // this means that we will keep data between different runs of the code
                                    // but we want to be really empty at each new run
                                    /*if (isEmpty) {
                                  console.log("this was the first loop!");
                                  answer.res.data && setAnswers([answer]);
                                  setIsEmpty(false);
                                } else {
                                  setIsEmpty(false);

                                  answer.res.data &&
                                    setAnswers(answers.concat(answer));
                                } */

                                    console.log("status", answer.status);
                                    //even answers 8xx will be actually answes 200
                                    if (answer.status !== 200) {
                                      console.log(
                                        "Loop stopped becaue of error with request: ",
                                        x,
                                        answer.res && answer.res.data
                                      );
                                      setIsLoading(false);

                                      break;
                                    }
                                  } catch (err) {
                                    console.log("Error", x);
                                    console.log("Error", err);
                                    setIsLoading(false);
                                    //setIsEmpty(false);
                                    //await timeout(1000);
                                  }
                              }
                              setIsLoading(false);
                            }}
                          >
                            {`Get Profiles  (${
                              linkedinUrl.split(",").length
                            } profiles)`}
                          </Button>
                        )}
                      </FormGroup>
                    </Col>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Template;
