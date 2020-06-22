import React, { useEffect, useState } from "react";

import { Checkbox } from "rsuite";
import { Button, FormGroup, Input, Row, Col } from "reactstrap";

import { useGlobal } from "../../store";

const SingleEmailGenerator = () => {
  const [globalState, globalActions] = useGlobal();

  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [domain, setDomain] = useState("");
  const [activePostVariator, setActivePostVariator] = useState("");

  useEffect(() => {}, []);

  return (
    <>
      <Row>
        <Col lg="6">
          <FormGroup>
            <label className="form-control-label" htmlFor="input-name">
              Name
            </label>
            <Input
              className="form-control-alternative"
              id="input-name"
              placeholder="Raïmond-philippe Samuel"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col lg="6">
          <FormGroup>
            <label className="form-control-label" htmlFor="input-last">
              Family Name
            </label>
            <Input
              className="form-control-alternative"
              id="input-last-name"
              placeholder="Tomlinson García"
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-company-domain"
            >
              Company Domain
            </label>
            <Input
              className="form-control-alternative"
              id="input-company-domain"
              placeholder="domain.xyz"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </FormGroup>
        </Col>

        <Col lg="6">
          <FormGroup>
            <label className="form-control-label" htmlFor="input-last">
              Options
            </label>
            <Checkbox
              onChange={(e, v) => {
                setActivePostVariator(v);
              }}
            >
              Active dot variations
            </Checkbox>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup className="pull-right mt-4">
            <Button
              color="primary"
              disabled={!name || !familyName || !domain}
              onClick={async (e) => {
                e.preventDefault();

                try {
                  let answer = await globalActions.server.GET(
                    "/generateEmail",
                    {
                      name,
                      familyName,
                      domain,
                      activePostVariator,
                    }
                  );

                  let { data } = answer.res;
                  globalActions.generator.setProp("emailList", data);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {`Generate combinations`}
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default SingleEmailGenerator;
