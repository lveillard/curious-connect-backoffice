import React, { useEffect, useState } from "react";

import { Row, Col, Container } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import BulkTable from "./bulkEmail/BulkTable";
import StudentMail from "./common/StudentMail";

import "../assets/css/bulk-emailing.css";

const BulkEmail = (props) => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    //get list of students
    globalActions.airtable.getStudents();
    globalActions.airtable.getReadyToSendEmails();
    //globalActions.airtable.getSentEmails();
    console.log("state", globalState);
  }, [globalState.bulkSender.selectedStudent, globalState.currentProgram]);

  useEffect(() => {
    globalState.bulkSender.selectedStudent &&
      globalActions.airtable.getSentEmails();
  }, [globalState.bulkSender.selectedStudent]);

  return (
    <>
      <EmailHeader />

      {globalState.gapiAuthed && (
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <StudentMail />
            </Col>

            <Col className="order-xl-1" xl="8">
              <BulkTable />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default BulkEmail;
