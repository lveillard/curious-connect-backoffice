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
  Col
} from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";
import { gapi, loadAuth2 } from 'gapi-script';

import { Input, ControlLabel } from "rsuite"

import MIMEText from "mimetext"




const Tools = () => {

  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send';
  const [auth2, setAuth2] = useState("");
  const [msg, setMsg] = useState("")

  const [inputs, setInputs] = useState({ sender: "saityro@gmail.com", recipient: "l.veillard@gmail.com", subject: "test subject", message: "Hola <b>Pedro</b>." });

  const [mime, setMime] = useState("test")

  function createDraft(userId, email, callback) {
    //preparing message
    const raw = prepareMsg()

    //create draft
    var request = gapi.client.gmail.users.drafts.create({
      'userId': 'me',
      'resource': {
        'message': {
          "raw": window.btoa(unescape(encodeURIComponent(raw))).replace(/\//g, '_').replace(/\+/g, '-')
        }
      }
    });
    request.execute(callback);
  }

  function sendMessage(userId, email, callback) {

    //preparing message
    const raw = prepareMsg()

    //sending the message
    var request = gapi.client.gmail.users.messages.send({
      'userId': 'me',
      'resource': {
        "raw": window.btoa(unescape(encodeURIComponent(raw))).replace(/\//g, '_').replace(/\+/g, '-')
      }
    });
    request.execute(callback);
  }


  const handleInputChange = (value, event) => {
    event.persist()
    setInputs(inputs => ({ ...inputs, [event.target.name]: value }));
  }


  function listDrafts(userId, callback) {
    var request = gapi.client.gmail.users.drafts.list({
      'userId': userId
    });
    request.execute(function (resp) {
      var drafts = resp.drafts;
      console.log(JSON.stringify(drafts));
    });
  }



  function initClient() {
    gapi.client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      clientId: process.env.REACT_APP_CLIENT_ID,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
      scope: SCOPES
    }).then(function () {
      // Handle the initial sign-in state.
      console.log("isSignedIn", gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function (error) {
      console.log(JSON.stringify(error, null, 2));
    });
  }


  function handleAuthClick(event) {
    gapi.load('client:auth2', initClient);

    gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function getStatus(event) {
    const status = gapi.auth2.getAuthInstance().isSignedIn.get()
    console.log("status", status)
  }

  function listLabels() {
    gapi.client.gmail.users.labels.list({
      'userId': 'me'
    }).then(function (response) {
      var labels = response.result.labels;
      console.log('Labels:');

      if (labels && labels.length > 0) {
        console.log(labels)

      } else {
        console.log('No Labels found.');
      }
    });
  }

  function prepareMsg() {
    const message = new MIMEText()
    message.setSender(inputs.sender)
    message.setRecipient(inputs.recipient)
    message.setSubject(inputs.subject)
    message.setMessage(inputs.message)
    console.log("message", message)
    return message.asRaw()

  }


  function listThreads() {
    gapi.client.gmail.users.threads.list({
      'userId': 'me'
    }).then(function (response) {
      var result = response.result;
      console.log('Result:');
      console.log(result)

    });
  }





  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const auth2 = await loadAuth2("176023017425-brh21v32fs8dddrnfs608856sid7k9ks.apps.googleusercontent.com", SCOPES);
        setAuth2({ auth2 })
      } catch (error) { console.log("error:", error) }
      try {
        gapi.load('client:auth2', initClient);
      } catch (err) {
        console.log("error: ", err)
      }
      console.log("auth2", auth2)
    }

    setAuth2(fetchMyAPI());
    console.log(decodeURIComponent(escape(window.atob(("TUlNRS1WZXJzaW9uOiAxLjANCkRhdGU6IFRodSwgMjMgQXByIDIwMjAgMjE6MjQ6MDQgKzAyMDANCk1lc3NhZ2UtSUQ6IDxDQUdNektIX3FwcUhDR3Y1MWhBWEhQX1hqOXAwQk9YYUphWDA5TWFPNE9jK08wVDVFQ1FAbWFpbC5nbWFpbC5jb20")))))

  }, []);



  return (
    <>
      <EmailHeader />


      <Container className="mt--7" fluid >

        <br />

        <Button onClick={(e) => handleAuthClick(e)} id="authorize_button" >Authorize</Button>

        <Button onClick={(e) => handleSignoutClick(e)} id="signout_button">Sign Out</Button>

        <Button onClick={(e) => listLabels(e)} id="get_labels">Labels</Button>

        <Button onClick={(e) => listThreads(e)} id="get_threads">Threads</Button>

        {// <Button onClick={(e) => getStatus(e)} id="get_status">Status</Button> 
        }


        <Button onClick={() => listDrafts("me")} id="list_drafts">List Draft</Button>



        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      TEXT-CONTENT
                      </h6>
                    <h2 className="text-white mb-0">Send test</h2>
                  </div>
                  <div className="col">





                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="">

                  <Form>
                    <FormGroup>
                      <ControlLabel className="text-light">Sender</ControlLabel>
                      <Input value={inputs.sender} onChange={(value, event) => handleInputChange(value, event)} name="sender" />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel className="text-light" >Recipient</ControlLabel>
                      <Input value={inputs.recipient} onChange={(value, event) => handleInputChange(value, event)} name="recipient" />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel className="text-light" >Subject</ControlLabel>
                      <Input value={inputs.subject} onChange={(value, event) => handleInputChange(value, event)} name="subject" />
                    </FormGroup>

                    <FormGroup>
                      <ControlLabel className="text-light" >Message</ControlLabel>
                      <Input value={inputs.message} onChange={(value, event) => handleInputChange(value, event)} name="message"
                        componentClass="textarea"
                        style={{ resize: 'auto' }}
                        rows={10}

                      />
                    </FormGroup>

                    <FormGroup>
                      <Button onClick={(e) => createDraft(e)} id="create_draft">Create Draft</Button>
                      <Button onClick={(e) => sendMessage(e)} id="send_message">Send Message</Button>
                    </FormGroup>


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
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      MIME ENCODED
                      </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>

                <div>

                  <Input
                    componentClass="textarea"
                    rows={10}
                    style={{ resize: 'auto' }}
                    placeholder="resize: 'auto'"
                    value={JSON.stringify(mime, undefined, 2)}
                  />

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>





      </Container>




    </ >)
}



export default Tools;
