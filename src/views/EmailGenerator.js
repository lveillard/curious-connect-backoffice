import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Container,
  Alert as Info,
  Row,
  Col,
} from "reactstrap";

import { useGlobal } from "../store";
import BulkEmailGenerator from "./emailGenerator/BulkMailGenerator";
import SingleEmailGenerator from "./emailGenerator/SingleMailGenerator";

const EmailGenerator = () => {
  const [isBulk, setIsBulk] = useState(false);

  useEffect(() => {
    /*async function fetchMyAPI() {
 
    }*/
  }, []);

  return (
    <>
      <div className="bg-gradient-primary" style={{ height: "200px" }}></div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1 mb-5" xl={isBulk ? "12" : "8"}>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Generate Email</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <FormGroup>
                      <Button
                        color="primary"
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsBulk((bulk) => !bulk);
                        }}
                        size="sm"
                      >
                        {isBulk ? "individual" : "Bulk"}
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted">Target data</h6>
                  <Info className="mb-4" color="primary" fade={false}>
                    - You can use complex names or family names like
                    "Jean-Philippe" <br /> - You can use up to 3 names / family
                    names
                    <br /> - You can use special characters like è, ô, ï...
                  </Info>
                  <div className="">
                    {isBulk ? (
                      <Row>
                        <Col>
                          <BulkEmailGenerator />
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col>
                          <SingleEmailGenerator />
                        </Col>
                      </Row>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/*globalState.mailGenerator.emailList.length > 0 && (
            <Col className="order-xl-2 mb-5" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Verify bounce</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <FormGroup>
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
                        </Button>
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
                      ) */}
        </Row>
      </Container>
    </>
  );
};

export default EmailGenerator;
