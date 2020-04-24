import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";
import { gapi, loadAuth2 } from "gapi-script";

import { Input, ControlLabel } from "rsuite";

import { useGlobal } from "../store";

import MIMEText from "mimetext";

import "../assets/css/emailing.css";

const Tools = () => {
  const [globalState, globalActions] = useGlobal();
  const SCOPES =
    "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send";

  const [auth2, setAuth2] = useState("");

  const [drafts, setDrafts] = useState([]);

  const [file, setFile] = useState("");

  const [inputs, setInputs] = useState({
    sender: "Fred Foo <saityro@gmail.com>",
    recipient: "l.veillard@gmail.com",
    subject: "test subject",
    message: "Hola <b>Pedro</b>.",
  });

  function createDraft(userId, email, callback) {
    //preparing message
    const raw = prepareMsg();

    //create draft
    var request = gapi.client.gmail.users.drafts.create({
      userId: "me",
      resource: {
        message: {
          raw: window
            .btoa(unescape(encodeURIComponent(raw)))
            .replace(/\//g, "_")
            .replace(/\+/g, "-"),
        },
      },
    });
    request.execute(callback);
  }

  function sendMessage(userId, email, callback) {
    //preparing message
    const raw = prepareMsg();

    //sending the message
    var request = gapi.client.gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: window
          .btoa(unescape(encodeURIComponent(raw)))
          .replace(/\//g, "_")
          .replace(/\+/g, "-"),
      },
    });
    request.execute(callback);
  }

  const handleInputChange = (value, event) => {
    event.persist();
    setInputs((inputs) => ({ ...inputs, [event.target.name]: value }));
  };

  function listDrafts(userId, callback) {
    if (!gapi.client) {
      return null;
    }
    var request = gapi.client.gmail.users.drafts.list({
      userId: userId,
    });
    request.execute(function (resp) {
      var drafts = resp.drafts;
      setDrafts(drafts);
      console.log("drafts", drafts);
    });
  }

  function initClient() {
    gapi.client
      .init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
        ],
        scope: SCOPES,
      })
      .then(
        function () {
          // Handle the initial sign-in state.
          console.log(
            "isSignedIn",
            gapi.auth2.getAuthInstance().isSignedIn.get()
          );
        },
        function (error) {
          console.log(JSON.stringify(error, null, 2));
        }
      );
  }

  function getStatus(event) {
    const status = gapi.auth2.getAuthInstance().isSignedIn.get();
    console.log("status", status);
  }

  function listLabels() {
    gapi.client.gmail.users.labels
      .list({
        userId: "me",
      })
      .then(function (response) {
        var labels = response.result.labels;
        console.log("Labels:");

        if (labels && labels.length > 0) {
          console.log(labels);
        } else {
          console.log("No Labels found.");
        }
      });
  }

  function prepareMsg() {
    const message = new MIMEText();
    message.setSender(inputs.sender);
    message.setRecipient(inputs.recipient);
    message.setSubject(inputs.subject);
    message.setMessage(inputs.message);

    if (file) {
      const attatchment = {
        type: file.type,
        filename: file.name,
        base64Data: file.base64.substring(file.base64.search(",") + 1),
      };
      message.setAttachments([attatchment]);
    }

    return message.asRaw();
  }

  function toByteStream(event) {
    const file = event.target.files[0];

    var reader = new FileReader();

    reader.onload = function (event) {
      let fileInfo = {
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1000) + " kB",
        base64: reader.result,
        file: file,
      };

      // var arrayBuffer = event.target.result,
      //  array = new Uint8Array(arrayBuffer),
      // binaryString = String.fromCharCode.apply(String, array);

      // setFile(binaryString);
      setFile(fileInfo);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };

    //reader.readAsArrayBuffer(event.target.files[0]);
    reader.readAsDataURL(file);
  }

  function listThreads() {
    gapi.client.gmail.users.threads
      .list({
        userId: "me",
      })
      .then(function (response) {
        var result = response.result;
        setDrafts(result);
        console.log("threads", drafts);
      });
  }

  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const auth2 = await loadAuth2(
          "176023017425-brh21v32fs8dddrnfs608856sid7k9ks.apps.googleusercontent.com",
          SCOPES
        );
        setAuth2({ auth2 });
      } catch (error) {
        console.log("error:", error);
      }
      try {
        gapi.load("client:auth2", initClient);
      } catch (err) {
        console.log("error: ", err);
      }
      console.log("auth2", auth2);
    }

    setAuth2(fetchMyAPI());
    console.log(
      decodeURIComponent(
        escape(
          window.atob(
            "TUlNRS1WZXJzaW9uOiAxLjANCkRhdGU6IFRodSwgMjMgQXByIDIwMjAgMjE6MjQ6MDQgKzAyMDANCk1lc3NhZ2UtSUQ6IDxDQUdNektIX3FwcUhDR3Y1MWhBWEhQX1hqOXAwQk9YYUphWDA5TWFPNE9jK08wVDVFQ1FAbWFpbC5nbWFpbC5jb20"
          )
        )
      )
    );
  }, []);

  return (
    <>
      <EmailHeader />

      {globalState.gapiAuthed && (
        <Container className="mt--7" fluid>
          <br />

          {
            // <Button onClick={(e) => listLabels(e)} id="get_labels">Labels</Button>
            // <Button onClick={(e) => getStatus(e)} id="get_status">Status</Button>
          }

          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card style={{ background: "#444" }} className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        TEXT-CONTENT
                      </h6>
                      <h2 className="text-white mb-0">Send test</h2>
                    </div>
                    <div className="col"></div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="dark-back">
                    <Form>
                      <FormGroup>
                        <ControlLabel className="text-light">
                          Sender
                        </ControlLabel>
                        <Input
                          value={inputs.sender}
                          onChange={(value, event) =>
                            handleInputChange(value, event)
                          }
                          name="sender"
                        />
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel className="text-light">
                          Recipient
                        </ControlLabel>
                        <Input
                          value={inputs.recipient}
                          onChange={(value, event) =>
                            handleInputChange(value, event)
                          }
                          name="recipient"
                        />
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel className="text-light">
                          Subject
                        </ControlLabel>
                        <Input
                          value={inputs.subject}
                          onChange={(value, event) =>
                            handleInputChange(value, event)
                          }
                          name="subject"
                        />
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel className="text-light">
                          Message
                        </ControlLabel>
                        <Input
                          value={inputs.message}
                          onChange={(value, event) =>
                            handleInputChange(value, event)
                          }
                          name="message"
                          componentClass="textarea"
                          style={{ resize: "auto" }}
                          rows={10}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Button
                          style={{ textAlign: "right" }}
                          color="warning"
                          onClick={(e) => createDraft(e)}
                          id="create_draft"
                        >
                          Create Draft
                        </Button>
                        <Button
                          style={{
                            background: "#18a3ff",
                            textTransform: "uppercase",
                          }}
                          className="float-right"
                          onClick={(e) => sendMessage(e)}
                          id="send_message"
                        >
                          <b> Send Message</b>
                        </Button>
                      </FormGroup>

                      <br />

                      <FormGroup>
                        <ControlLabel className="text-light" htmlFor="file">
                          {" "}
                          Attatchment{" "}
                        </ControlLabel>
                        <Input
                          type="file"
                          name="file"
                          id="file"
                          onChange={(v, e) => {
                            toByteStream(e);
                          }}
                        />
                      </FormGroup>

                      <Input
                        value={JSON.stringify(file)}
                        name="message"
                        disabled
                        componentClass="textarea"
                        style={{ resize: "auto" }}
                        rows={10}
                      />
                    </Form>

                    {/*<Input
                    componentClass="textarea"
                    rows={10}
                    style={{ resize: 'auto' }}
                    placeholder="resize: 'auto'"
                    value={JSON.stringify(msg, undefined, 2)}
                    onChange={(value) => setMsg(value)}
                  />*/}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card style={{ background: "#444" }} className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Drafts
                      </h6>
                      <h2 className="mb-0 text-white">Get drafts</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ color: "white" }}>
                    {drafts &&
                      drafts.length > 0 &&
                      drafts.map((x, key) => (
                        <li
                          onClick={() =>
                            console.log(globalActions.gapi.getDraft(x.id)) ||
                            "Load drafts..."
                          }
                          key={key}
                        >
                          {" "}
                          {x.id}{" "}
                        </li>
                      ))}
                  </div>
                  <br />
                  <Button
                    onClick={() => {
                      listDrafts("me");
                    }}
                    id="list_drafts"
                  >
                    List Drafts
                  </Button>
                </CardBody>
              </Card>

              <Card style={{ background: "#444" }} className="shadow mt-5">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Threads
                      </h6>
                      <h2 className="mb-0 text-white">Get threads</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ color: "white" }}>
                    {drafts &&
                      drafts.length > 0 &&
                      drafts.map((x, key) => (
                        <li
                          onClick={() =>
                            console.log(globalActions.gapi.getDraft(x.id))
                          }
                          key={key}
                        >
                          {" "}
                          {x.id}{" "}
                        </li>
                      ))}
                  </div>
                  <br />
                  <Button onClick={(e) => listThreads(e)} id="get_threads">
                    List Threads
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Tools;
