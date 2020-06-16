import React, { useEffect, useState } from "react";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Alert as Info,
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
  const [linkedinUrl, setLinkedinUrl] = useState(
    "https://www.linkedin.com/in/loic-veillard"
  );
  const [token, setToken] = useState("AQ...");

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
                        URL
                      </label>
                      <Input
                        className="form-control-alternative"
                        type="text"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup className="pull-right mt-4">
                      {" "}
                      <Button
                        color="primary"
                        onClick={async () => {
                          console.log(token, linkedinUrl);
                          let answer = await globalActions.server.GET(
                            "/linkedin",
                            false,
                            {
                              token,
                              linkedinUrl,
                            }
                          );
                          console.log(answer);
                        }}
                      >
                        Individual test linkedin
                      </Button>
                      <Button
                        color="danger"
                        onClick={async () => {
                          //it's a for as it has to be one by one
                          for (let x of linkedinUrl.split(",")) {
                            try {
                              console.log(x);
                              //await timeout(2000);
                              let answer = await globalActions.server.GET(
                                "/linkedin",
                                false,
                                {
                                  token,
                                  linkedinUrl: x.trim(),
                                }
                              );
                              answer.res.data &&
                                console.log(answer.res.data.data);
                            } catch (err) {
                              console.log("Error", x);
                              await timeout(1000);
                            }
                          }
                        }}
                      >
                        Stress test Linkedin
                      </Button>
                    </FormGroup>
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
