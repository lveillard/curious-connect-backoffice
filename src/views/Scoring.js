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
  Container,
  Row,
  Col,
} from "reactstrap";

import "../assets/css/emailing.css";

//steps:
// 1) Copy Scoring
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the code server curious-connect-server.herokuapp.com
// 4) grant the route permission to somebody in the mongodb

const Scoring = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);
  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div className="bg-gradient-primary" style={{ height: "200px" }}></div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1 mb-5" xl="6">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Load file</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <FormGroup>
                      <Button
                        color="primary"
                        onClick={async (e) => {
                          e.preventDefault();
                        }}
                        size="sm"
                      ></Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted">Target data</h6>
                  <div className=""></div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-2 mb-5" xl="6">
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
                        }}
                        size="sm"
                      ></Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted">Target data</h6>
                  <div className=""></div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>{" "}
    </>
  );
};

export default Scoring;
