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

import { toast } from "react-toastify";

import EmailHeader from "components/Headers/EmailHeader.js";
import { gapi } from "gapi-script";

import { Input, ControlLabel } from "rsuite";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

const Tools = () => {
  const [globalState, globalActions] = useGlobal();

  const [drafts, setDrafts] = useState([]);

  const [file, setFile] = useState("");

  const [inputs, setInputs] = useState({
    sender: "Fred Foo <saityro@gmail.com>",
    recipient: "l.veillard@gmail.com",
    subject: "test subject",
    message: "Hola <b>Pedro</b>.",
  });

  const handleInputChange = (value, event) => {
    event.persist();
    //it was target.name before
    setInputs((inputs) => ({ ...inputs, [event.target.firstName]: value }));
  };

  function createDraft(userId, email, callback) {
    //preparing message
    const raw = globalActions.mailing.prepareMsg(
      inputs.sender,
      inputs.recipient,
      inputs.subject,
      inputs.message,
      file
    );

    //create draft
    var request = globalActions.gapi.gmail().users.drafts.create({
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

  function loadFile(event) {
    const File = event.target.files[0];

    var reader = new FileReader();

    reader.onload = function (event) {
      let fileInfo = {
        name: File.name,
        type: File.type,
        size: Math.round(File.size / 1000) + " kB",
        base64: reader.result,
        file: File,
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
    try {
      reader.readAsDataURL(File);
    } catch (e) {
      console.log(event);
    }
  }

  function listDrafts(userId, callback) {
    if (!gapi.client) {
      return null;
    }
    var request = globalActions.gapi.gmail().users.drafts.list({
      userId: userId,
    });
    request.execute(function (resp) {
      var drafts = resp.drafts;
      setDrafts(drafts);
      console.log("drafts", drafts);
    });
  }

  function listThreads() {
    globalActions.gapi
      .gmail()
      .users.threads.list({
        userId: "me",
      })
      .then(function (response) {
        var result = response.result;
        setDrafts(result);
        console.log("threads", drafts);
      });
  }

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
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
                        SINGLE-EMAIL
                      </h6>
                      <h2 className="text-white mb-0">Send email</h2>
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
                          onClick={async (e) =>
                            globalActions.gapi.sendMessage(
                              await globalActions.mailing.prepareMsg(
                                inputs.sender,
                                inputs.recipient,
                                inputs.subject,
                                inputs.message,
                                file
                              ),
                              (answer) => {
                                if (answer.error) {
                                  //on error actions
                                  console.log(answer.error);

                                  toast.error("Error:" + answer.error.message, {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                } else {
                                  //on success actions
                                  console.log(answer);
                                  toast.success("Message sent!", {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                }
                              }
                            )
                          }
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

                        {/*setFile(globalActions.helpers.toByteStream(e));*/}

                        <Input
                          type="file"
                          name="file"
                          id="file"
                          onChange={(v, e) => {
                            loadFile(e);
                          }}
                        />
                      </FormGroup>

                      {/*<Input
                        value={JSON.stringify(file)}
                        name="message"
                        disabled
                        componentClass="textarea"
                        style={{ resize: "auto" }}
                        rows={10}
                      />*/}
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
              <Card style={{ background: "#444" }} className="shadow elements">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Senders
                      </h6>
                      <h2 className="mb-0 text-white">Get Senders</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ color: "white" }}>
                    {globalState.senders &&
                      globalState.senders.length > 0 &&
                      globalState.senders.map((x, key) => (
                        <li
                          onClick={() =>
                            setInputs({
                              ...inputs,
                              sender:
                                x.displayName + " <" + x.sendAsEmail + ">",
                            })
                          }
                          key={key}
                        >
                          {x.sendAsEmail}
                        </li>
                      ))}
                  </div>
                  <br />
                  <Button
                    onClick={(e) => {
                      globalActions.gapi.getSenders();
                    }}
                    id="get_senders"
                  >
                    List Senders
                  </Button>
                </CardBody>
              </Card>

              <Card style={{ background: "#444" }} className="shadow mt-5">
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
                        Scopes
                      </h6>
                      <h2 className="mb-0 text-white">Add Scope </h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ color: "white" }}></div>
                  <br />
                  <Button
                    onClick={async () => {
                      const answer = await globalActions.gapi.addScopes(
                        "https://www.googleapis.com/auth/gmail.settings.sharing"
                      );

                      console.log(globalState);

                      answer.googleUser.grant(answer.options).then(
                        function (success) {
                          console.log(
                            JSON.stringify({
                              message: "success",
                              value: success,
                            })
                          );
                        },
                        function (fail) {
                          alert(
                            JSON.stringify({ message: "fail", value: fail })
                          );
                        }
                      );
                    }}
                  >
                    Add scope
                  </Button>
                </CardBody>
              </Card>

              <Card style={{ background: "#444" }} className="shadow mt-5">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        History
                      </h6>
                      <h2 className="mb-0 text-white"> List history </h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ color: "white" }}></div>
                  <br />
                  <Button
                    onClick={() => {
                      globalActions.gapi.listHistory();
                    }}
                  >
                    List history
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
