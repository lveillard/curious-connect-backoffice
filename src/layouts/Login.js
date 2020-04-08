import React, { useState } from "react";

import { useGlobal } from "../store";

import {
  Col,
  FlexboxGrid,
  Panel,
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

function Login() {
  const [globalState, globalActions] = useGlobal();

  function login() {
    globalActions.login();
  }

  return (
    <div className="home-wrapper">
      <Container>
        <Content>
          <FlexboxGrid>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
              <div className="always" style={{ textAlign: "center" }}>
                <img
                  style={{
                    zIndex: 99999999,
                    maxHeight: "calc(50vh - 160px)",
                    margin: "25px 0 25px 0"
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
                      <InputGroup.Addon> 📧</InputGroup.Addon>
                      <Input />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon> 🔑 </InputGroup.Addon>

                      <Input name="password" type="password" />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <br />

                    <ButtonToolbar style={{ textAlign: "center" }}>
                      <Button block onClick={login} appearance="primary">
                        Sign in
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
                shaded
                bordered
                bodyFill
                style={{
                  backgroundImage: `url("/images/loginphoto3.jpg")`,
                  backgroundSize: "cover",
                  backgroundPosition: "50%",
                  height: "100vh"
                }}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>{" "}
    </div>
  );
}

export default Login;
