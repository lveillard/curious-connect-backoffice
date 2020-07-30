import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { useGlobal } from "../store";

import {
  Col,
  FlexboxGrid,
  Panel,
  Loader,
  Form,
  FormGroup,
  ControlLabel,
  Button,
  ButtonToolbar,
  Container,
  InputGroup,
  Input,
  Content,
} from "rsuite";

const Login = () => {
  useEffect(() => {
    async function fetchMyAPI() {
      await globalActions.login.getUser();
    }
    if (localStorage.getItem("token")) {
      fetchMyAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let history = useHistory();

  const [globalState, globalActions] = useGlobal();
  /*const [inputs, setInputs] = useState({
    password: "formatricesaccess",
    email: "formatrices@curious-connect.com",
  });*/

  const [password, setPassword] = useState("formatricesaccess");
  const [email, setEmail] = useState("formatrices@curious-connect.com");

  const [missingData] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.replace("/admin");
    }
  }, [history]);

  async function login(e) {
    if (globalState) {
    }
    e.preventDefault();
    let test = await globalActions.login.login({ password, email });
    if (test) {
      history.replace("/admin");
    } else {
    }
  }

  const errorMessage = missingData ? "This field is required" : null;

  return (
    <div className="home-wrapper">
      <Container
        style={{
          background: "#2c3e50",
          height: "100vh",
        }}
      >
        <Content>
          <FlexboxGrid>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
              <div className="always" style={{ textAlign: "center" }}>
                <img
                  style={{
                    zIndex: 99999999,
                    maxHeight: "calc(45vh - 160px)",
                    margin: "25px 0 25px 0",
                  }}
                  src={"/images/logo3.png"}
                  alt="holi"
                />{" "}
              </div>
              <Panel
                style={{ background: "#ebefff", margin: "0 25px 0 25px" }}
                header={
                  <h3 style={{ textAlign: "center" }}>
                    Curious Connect - Back Office
                  </h3>
                }
                bordered
              >
                <Form fluid>
                  <FormGroup>
                    <ControlLabel>Email address</ControlLabel>

                    <InputGroup>
                      <InputGroup.Addon>
                        {" "}
                        <span role="img" aria-label="email">
                          📧
                        </span>{" "}
                      </InputGroup.Addon>
                      <Input
                        value={email}
                        onChange={(value, event) =>
                          //handleInputChange(value, event)
                          //console.log(value)
                          setEmail(value)
                        }
                        name="email"
                        autoFocus={true}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon>
                        {" "}
                        <span role="img" aria-label="key">
                          🔑
                        </span>{" "}
                      </InputGroup.Addon>

                      <Input
                        value={password}
                        onChange={(value, event) =>
                          //handleInputChange(value, event)
                          setPassword(value)
                        }
                        name="password"
                        type="password"
                      />
                    </InputGroup>
                    <div
                      style={{
                        display: missingData && !password ? "block" : "none",
                        color: "red",
                        marginTop: 6,
                      }}
                    >
                      {errorMessage}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <br />

                    <ButtonToolbar style={{ textAlign: "center" }}>
                      <Button
                        type="submit"
                        block
                        onClick={login}
                        appearance="primary"
                        disabled={
                          globalState.status === "LOADING" ||
                          missingData ||
                          !password ||
                          !email
                        }
                      >
                        {globalState.status === "LOADING" ? (
                          <Loader style={{ color: "white" }} />
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                      <Button appearance="link">Forgot password?</Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </Panel>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item
              componentClass={Col}
              colspan={24}
              md={12}
              smHidden
            >
              <Panel
                style={{
                  borderRadius: "0px",
                  backgroundImage: `url("/images/loginphoto3.jpg")`,
                  backgroundSize: "cover",
                  backgroundPosition: "50%",
                  height: "100vh",
                }}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>{" "}
    </div>
  );
};

export default Login;
