import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  ButtonGroup,
  FormGroup,
} from "reactstrap";

import { Input as Uploader } from "rsuite";

import { useGlobal } from "../../store";

import { loadJson } from "../../utils/coreHelpers";

const SenderUpload = () => {
  const [globalState, globalActions] = useGlobal();
  const [file, setFile] = useState(null);

  return (
    <>
      {globalState.bulkSender.currentStudent ? (
        <Card className="card-profile shadow">
          <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0">
            <div className="d-flex justify-content-between">
              <b> JSON upload</b>{" "}
              <Button
                className="float-right"
                style={{
                  marginTop: "14px",
                }}
                color="primary"
                disabled={!file}
                onClick={async (e) => {
                  e.preventDefault();
                  const translated = file.data
                    .filter((y) => y.type)
                    .map((x) => {
                      return {
                        ...x,
                        record: globalState.bulkSender.currentStudent.record,
                      };
                    });
                  console.log(translated);
                  await globalActions.server.POST("/sender", translated);
                }}
                size="sm"
              >
                Load
              </Button>
            </div>
          </CardHeader>
          <CardBody className="pt-0 pt-md-2">
            <Row>
              <Col className="mt-4">
                <FormGroup>
                  <label className="form-control-label mt-4" htmlFor="id">
                    Selected student's email:
                  </label>
                  <div>
                    {" "}
                    {globalState.bulkSender.currentStudent.emailSender}
                  </div>
                </FormGroup>
                <FormGroup>
                  <label className="form-control-label mt-4" htmlFor="id">
                    Import JSON
                  </label>
                  <Uploader
                    color="primary"
                    type="file"
                    name="file"
                    id="file"
                    onChange={async (v, e) => {
                      setFile(await loadJson(e));
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0">
            <div className="d-flex justify-content-between">
              <b>JSON upload</b>
              <Button disabled={true} className="float-right" size="sm">
                Load
              </Button>
            </div>
          </CardHeader>{" "}
          <CardBody>
            <div> Please load a student first... </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SenderUpload;
