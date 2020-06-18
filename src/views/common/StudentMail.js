import React, { useEffect, useState } from "react";

import { Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap";

import Select from "react-select";

import { useGlobal } from "../../store";

const StudentMail = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    /*async function fetchMyAPI() {
    }*/
  }, []);

  return (
    <>
      <Card className="card-profile shadow">
        <Row className="justify-content-center">
          <Col className="order-lg-2" lg="3">
            <div className="card-profile-image">
              <a
                href={
                  globalState.bulkSender.currentStudent &&
                  globalState.bulkSender.currentStudent.files[0].url
                }
                download="hello"
                onClick={(e) => {
                  e.preventDefault();

                  globalState.bulkSender.currentStudent &&
                    window.open(
                      globalState.bulkSender.currentStudent.files[0].url
                    );
                }}
              >
                <img
                  style={
                    globalState.bulkSender.currentStudent && {
                      marginTop: "135px",
                      clip: "rect(0px,250px,77px,0px)",
                      maxWidth: "250px",
                      width: "250px",
                    }
                  }
                  width="170px"
                  alt="..."
                  className={
                    !globalState.bulkSender.currentStudent
                      ? "rounded-circle"
                      : "meh"
                  }
                  src={
                    (globalState.bulkSender.currentStudent &&
                      globalState.bulkSender.currentStudent.files[0].thumbnails
                        .large.url) ||
                    "https://seeklogo.com/images/A/airtable-logo-216B9AF035-seeklogo.com.png"
                  }
                />
              </a>
            </div>
          </Col>
        </Row>
        <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0">
          <div className="d-flex justify-content-between">
            <div></div>
            <Button
              className="float-right"
              style={{
                marginTop: "14px",
              }}
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                globalActions.airtable.getStudents();
              }}
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0 pt-md-2">
          <Row>
            <div className="col">
              <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                {globalState.isLoading.sentRecords && "Loading stats..."}

                {globalState.sentRecords && !globalState.isLoading.sentRecords && (
                  <>
                    <div>
                      <span className="heading">
                        {globalState.sentMetrics.sentCount}
                      </span>
                      <span className="description">Sent</span>
                    </div>
                    <div>
                      <span className="heading">
                        {globalState.sentMetrics.companies}
                      </span>
                      <span className="description">Companies</span>
                    </div>
                    <div>
                      <span className="heading">
                        {globalState.sentMetrics.limits}
                      </span>
                      <span className="description">limits</span>
                    </div>

                    <div>
                      <span className="heading">
                        {globalState.sentMetrics.bounced}
                      </span>
                      <span className="description">Bounced</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Row>

          <div className="mb-3">
            <Select
              className="selector"
              classNamePrefix="select"
              isDisabled={globalState.isLoading.airtable}
              isLoading={globalState.isLoading.airtable}
              isClearable
              isSearchable
              onChange={(selected, type) => {
                globalActions.bulkSender.setCurrentStudent(selected);
                if (type.action === "clear")
                  globalActions.bulkSender.setCurrentStudent(null);
              }}
              value={globalState.bulkSender.selectedStudent}
              options={
                globalState.students &&
                globalState.students.map((x) => {
                  return {
                    value: x.emailSender,
                    label: x.name + " " + x.familyName,
                  };
                })
              }
            />
          </div>
          {globalState.bulkSender.currentStudent && (
            <div className="text-center">
              <h3>
                {globalState.bulkSender.selectedStudent.label}
                <span className="h5 font-weight-light">
                  {" (" + globalState.bulkSender.currentStudent.age + ")"}
                </span>
              </h3>
              <div className="h5 font-weight-300">
                <i className="ni location_pin mr-2" />
                Region
              </div>
              <div className="h5 mt-4">
                <i className="ni business_briefcase-24 mr-2" />
                {globalState.bulkSender.currentStudent.formation}
              </div>
              <div>
                <i className="ni education_hat mr-2" />
                {globalState.bulkSender.currentStudent.school}
              </div>
              <hr className="my-4" />

              <div
                style={{
                  whiteSpace: "pre-line",
                  textAlign: "justify",
                }}
              >
                {globalState.bulkSender.currentStudent.emailContent}
              </div>
              <p> ------------------- </p>
              <p>{globalState.bulkSender.currentStudent.emailSignature}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default StudentMail;
