import React from "react";

// reactstrap components
import { Button, Container, Row } from "reactstrap";
import { useGlobal } from "../../store";

const UserHeader = () => {
  const [globalState, globalActions] = useGlobal();

  return (
    <>
      <div
        className="header bg-primary pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "400px",
        }}
      >
        {/* Mask */}
        <span className="mask  opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <div className="header-body container-fluid">
            <Row>
              <div className="col-xl">
                {" "}
                <h1 className="display-2 text-white">Emailing</h1>{" "}
              </div>
              <div className="col-xl d-flex flex-column">
                {" "}
                {!globalState.gapiAuthed && (
                  <Button
                    style={{ marginTop: "auto" }}
                    color="success"
                    onClick={(e) => globalActions.gapi.handleAuth(e)}
                    id="authorize_button"
                  >
                    Authorize GMAIL
                  </Button>
                )}
              </div>
            </Row>

            <Row style={{ marginRight: "10px", marginLeft: "auto" }}></Row>
            {globalState.guser && (
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 ">
                  <div className="card card-stats">
                    <div className="card-body">
                      <div className="row">
                        <div className="col">
                          <h5 className="card-title text-uppercase text-muted mb-0">
                            User
                          </h5>
                          <span className="h2 font-weight-bold mb-0">
                            {globalState.guser.getName()}
                          </span>
                          <p className="mb-0 text-sm">
                            <i> {"<" + globalState.guser.getEmail() + ">"} </i>
                          </p>
                        </div>
                        <div className="col-auto">
                          <img
                            style={{ borderRadius: "50%" }}
                            width="48"
                            height="48"
                            alt="holi"
                            src="https://lh4.googleusercontent.com/-fWT46h7Z8As/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJP6XP26_GHoMbGbaCiUovDGjD_55g/s96-c/photo.jpg"
                          />{" "}
                        </div>
                      </div>

                      <Button
                        style={{ float: "right" }}
                        color="danger"
                        onClick={() => {
                          globalActions.gapi.handleSignout();
                        }}
                        id="signout_button"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
