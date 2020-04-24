import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import { useGlobal } from "../../store";

const UserHeader = () => {
  const [globalState, globalActions] = useGlobal();

  return (
    <>
      <div
        className="header bg-primary pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "300px",
        }}
      >
        {/* Mask */}
        <span className="mask  opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Emailing</h1>
            </Col>
            <Col></Col>
          </Row>
          <Row style={{ marginRight: "10px", marginLeft: "auto" }}>
            {!globalState.gapiAuthed && (
              <Button
                color="success"
                onClick={(e) => globalActions.gapi.handleAuth(e)}
                id="authorize_button"
              >
                Authorize
              </Button>
            )}

            {globalState.gapiAuthed && (
              <Button
                color="danger"
                onClick={() => {
                  globalActions.gapi.handleSignout();
                }}
                id="signout_button"
              >
                Sign Out
              </Button>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
