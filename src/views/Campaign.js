import React, { useEffect, useState } from "react";

import { Row, Col, Container } from "reactstrap";

import { useGlobal } from "../store";

import StudentMail from "./common/StudentMail";

const Campaign = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div className="bg-gradient-info" style={{ height: "200px" }}>
        {" "}
      </div>

      <Container className="mt--7" fluid>
        <Row>
          <Col className=" mb-5 mb-xl-0">
            <StudentMail />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Campaign;
