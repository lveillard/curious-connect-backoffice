import React, { useEffect, useState } from "react";

import { Checkbox } from "rsuite";
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

import { useGlobal } from "../store";

//steps:
// 1) Copy EmailGenerator
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the server https://glitch.com/edit/#!/ccbo?path=routes%2Froutes.js%3A1%3A0
// 4) grant the route permission to somebody in the mongodb

const EmailGenerator = () => {
  const [globalState, globalActions] = useGlobal();

  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [domain, setDomain] = useState("");
  const [activePostVariator, setActivePostVariator] = useState("");

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
    //globalActions.gapi.load();
  }, []);

  return (
    <>
      <div className="bg-gradient-primary" style={{ height: "200px" }}>
        {" "}
      </div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Generate Email</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <FormGroup>
                      {" "}
                      {false && (
                        <Button
                          color="danger"
                          disabled={true || !name || !familyName || !domain}
                          onClick={(e) => {
                            e.preventDefault();
                            globalActions.generator.hardGenerate(
                              name,
                              familyName,
                              domain,
                              activePostVariator
                            );
                          }}
                          size="sm"
                        >
                          Hard-generate
                        </Button>
                      )}
                      <Button
                        color="primary"
                        disabled={!name || !familyName || !domain}
                        onClick={(e) => {
                          e.preventDefault();
                          globalActions.generator.generate(
                            name,
                            familyName,
                            domain,
                            activePostVariator
                          );
                        }}
                        size="sm"
                      >
                        Generate
                      </Button>{" "}
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">Information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Ray"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last"
                          >
                            Family Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="Tomlinson"
                            type="text"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-company-domain"
                          >
                            Company Domain
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-company-domain"
                            placeholder="domain.xyz"
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                          />
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last"
                          >
                            Options
                          </label>
                          <Checkbox
                            onChange={(e, v) => {
                              setActivePostVariator(v);
                            }}
                          >
                            Active dot variations
                          </Checkbox>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {globalState.mailGenerator.emailList.length > 0 && (
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Verify bounce</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <FormGroup>
                        {" "}
                        <Button
                          color="warning"
                          disabled={!name || !familyName || !domain}
                          onClick={(e) => {
                            e.preventDefault();
                            globalActions.generator.generate(
                              name,
                              familyName,
                              domain,
                              activePostVariator
                            );
                          }}
                          size="sm"
                        >
                          Verify
                        </Button>{" "}
                      </FormGroup>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody className="pt-0 pt-md-4">
                  <h6 className="heading-small text-muted mb-4">
                    Possible emails
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      {globalState.mailGenerator.emailList.map((x, key) => (
                        <Col key={key} md="8">
                          <label className="form-control-label">
                            {x.value + " (" + x.label + ")"}
                            {x.dot ? "*" : ""}
                          </label>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default EmailGenerator;
