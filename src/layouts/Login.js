import React, { useState, useEffect } from "react";

import {
  useHistory,
} from "react-router-dom";


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

const Login = () => {

  useEffect(() => {
    async function fetchMyAPI() {
      const response = await globalActions.login.getUser()
    }
    if (localStorage.getItem("token")) { fetchMyAPI() }
  }, []);


  let history = useHistory();


  const [globalState, globalActions] = useGlobal();
  const [inputs, setInputs] = useState({ password: "formatricesaccess", email: "formatrices@curious-connect.com" });
  const [missingData, setMissingData] = useState();

  useEffect(() => {

    if (localStorage.getItem("token")) { history.replace("/admin") }

  }, []);


  async function login(e) {
    e.preventDefault();
    let test = await globalActions.login.login(inputs)
    if (test) { history.replace("/admin"); } else {
    }
  }

  const handleInputChange = (value, event) => {
    event.persist()
    setInputs(inputs => ({ ...inputs, [event.target.name]: value }));
  }

  const errorMessage = missingData ? 'This field is required' : null;


  return (
    <div className="home-wrapper">
      <Container style={{
        background: "#2c3e50",
        height: "100vh"
      }}>
        <Content>
          <FlexboxGrid>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
              <div className="always" style={{ textAlign: "center" }}>
                <img
                  style={{
                    zIndex: 99999999,
                    maxHeight: "calc(45vh - 160px)",
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
                      <Input value={inputs.email} onChange={(value, event) => handleInputChange(value, event)} name="email" autoFocus={true} />

                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon> 🔑 </InputGroup.Addon>

                      <Input value={inputs.password} onChange={(value, event) => handleInputChange(value, event)} name="password" type="password" />
                    </InputGroup>
                    <div
                      style={{
                        display: missingData && !inputs.password ? 'block' : 'none',
                        color: 'red',
                        marginTop: 6
                      }}
                    >
                      {errorMessage}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <br />

                    <ButtonToolbar style={{ textAlign: "center" }}>
                      <Button type="submit" block onClick={login} appearance="primary" disabled={missingData || !inputs.password || !inputs.email}>
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
                style={{
                  borderRadius: "0px",
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
    </div >
  );
}

export default Login;
