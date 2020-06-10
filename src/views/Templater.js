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

import { Input, ControlLabel } from "rsuite";

import { toast } from "react-toastify";
// import { Loader, Checkbox, Whisper, Tooltip } from "rsuite";

import Select from "react-select";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

const Templater = () => {
  const [globalState, globalActions] = useGlobal();
  // const [senders, setSenders] = useState([]);
  const [inputs, setInputs] = useState({
    senderName: "",
    senderEmail: "",
    sender: "Curious Connect <accelerateur.alternance@gmail.com>",
    recipient: "",
    subject: "test subject",
    message: "Hola <b>Pedro</b>.",
  });

  const [file, setFile] = useState("");

  const handleInputChange = (value, event) => {
    event.persist();
    setInputs((inputs) => ({ ...inputs, [event.target.name]: value }));
  };

  const setInput = (input, value) => {
    setInputs((inputs) => ({ ...inputs, [input]: value }));
  };

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

  useEffect(() => {
    //load templates onload

    globalActions.mailing.getTemplates();
  }, []);

  return (
    <>
      <EmailHeader title="Template sender" />
      {globalState.gapiAuthed && (
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="6">
                      <h3 className="mb-0">Send Email</h3>
                    </Col>
                    <Col className="text-right" xs="6">
                      <FormGroup>
                        {" "}
                        <Button color="primary" onClick={(e) => {}} size="sm">
                          Refresh template
                        </Button>{" "}
                      </FormGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <h6 className="heading-small text-muted">Select template</h6>
                  <Select
                    className="selector"
                    classNamePrefix="select"
                    isDisabled={false}
                    isLoading={false}
                    isClearable
                    isSearchable
                    onChange={(selected, type) => {
                      if (type.action === "clear") {
                        setInput("message", "");
                      } else setInput("message", selected.content);
                    }}
                    options={globalState.templates}
                  />
                  <Form className="mt-3">
                    <h6 className="heading-small text-muted">Target data</h6>

                    <Row>
                      <Col lg="6">
                        {" "}
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Sender email
                          </ControlLabel>
                          <Select
                            className="selector"
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={false}
                            isClearable
                            isSearchable
                            value={{ label: inputs.senderEmail }}
                            onChange={(selected, type) => {
                              if (type.action === "clear") {
                                setInput("sender", "");
                                setInput("senderName", "");
                                setInput("senderEmail", "");
                              } else {
                                setInput("sender", selected.label);
                                setInput("senderName", selected.name);
                                setInput("senderEmail", selected.value);
                              }
                            }}
                            options={
                              globalState.senders &&
                              globalState.senders.length > 0 &&
                              globalState.senders.map((x) => {
                                return {
                                  label:
                                    x.displayName + " <" + x.sendAsEmail + ">",
                                  value: x.sendAsEmail,
                                  name: x.displayName,
                                };
                              })
                            }
                          />{" "}
                        </FormGroup>{" "}
                      </Col>
                      <Col lg="6">
                        {" "}
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Sender name
                          </ControlLabel>
                          <Input
                            value={inputs.senderName}
                            onChange={(value, event) => {
                              setInput("senderName", value);
                              setInput(
                                "sender",
                                value + " <" + inputs.senderEmail + ">"
                              );
                              console.log("sender", inputs.sender);
                            }}
                            name="senderName"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <ControlLabel className="form-control-label">
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
                      <ControlLabel className="form-control-label">
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
                      <ControlLabel className="form-control-label">
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

                    <br />

                    <FormGroup>
                      <ControlLabel htmlFor="file">Attatchment</ControlLabel>

                      <Input
                        type="file"
                        name="file"
                        id="file"
                        onChange={(v, e) => {
                          loadFile(e);
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Button
                        color="primary"
                        style={{
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
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Templater;
