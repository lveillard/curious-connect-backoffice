import React, { useEffect, useState } from "react";

import { Input as Uploader } from "rsuite";

import { useGlobal } from "../store";
import { loadJson } from "../utils/coreHelpers";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Container,
  Row,
  Col,
} from "reactstrap";

import { Input, ControlLabel } from "rsuite";

import DataSheet2, { setRow } from "../components/Common/DataSheet2";

import "../assets/css/emailing.css";

//steps:
// 1) Copy Scoring
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the code server curious-connect-server.herokuapp.com
// 4) grant the route permission to somebody in the mongodb

const Scoring = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  const [file, setFile] = useState(null);
  const [stats, setStats] = useState({});

  const initHierarchy = [
    {
      value: "head",
      weight: 1,
    },
    {
      value: "manager",
      weight: 1,
    },
    {
      value: "director",
      weight: 1,
    },
    {
      value: "directeur",
      weight: 1,
    },
    {
      value: "leader",
      weight: 1,
    },
    {
      value: "lead",
      weight: 1,
    },
    {
      value: "senior",
      weight: 0.9,
    },
    {
      value: "responsable",
      weight: 0.9,
    },
    {
      value: "president",
      weight: 0.8,
    },
    {
      value: "founder",
      weight: 0.8,
    },
    {
      value: "co-founder",
      weight: 0.8,
    },
    {
      value: "chef",
      weight: 0.8,
    },
    {
      value: "chief",
      weight: 0.8,
    },
    {
      value: "global",
      weight: 0.7,
    },
    {
      value: "international",
      weight: 0.7,
    },
    {
      value: "regional",
      weight: 0.7,
    },
    {
      value: "chargé",
      weight: 0.6,
    },
    {
      value: "ceo",
      weight: 0.6,
    },
    {
      value: "analyste",
      weight: 0.5,
    },
    {
      value: "assistant",
      weight: 0.5,
    },
    {
      value: "board",
      weight: 0.3,
    },
  ];

  const [hierarchyFilters, setHierarchyFilters] = useState(initHierarchy);
  const [positionFilters, setPositionFilters] = useState([{}, {}]);
  const [negativeFilters, setNegativeFilters] = useState(
    "stagiaire, alternant"
  );

  const sortBy = (obj, by, num = 1) => {
    return obj.sort((a, b) => (a[by] > b[by] ? -num : b[by] > a[by] ? num : 0));
  };

  const initCols = React.useMemo(
    () => [
      {
        value: "Value",
        key: "value",
        col: 0,
        readOnly: true,
      },
      {
        value: "Weight",
        key: "weight",
        col: 1,
        readOnly: true,
        width: "25%",
      },
    ],
    []
  );
  const [cols, setCols] = useState(initCols);

  useEffect(() => {
    if (file) {
      console.log("file", file);
      setStats({
        lines: file.data.length,
        companies: new Set(file.data.map((x) => x.companyId || x.CompanyID))
          .size,
      });
    }
  }, [file]);

  //autoSort
  useEffect(() => {
    if (hierarchyFilters) {
      setHierarchyFilters((values) => sortBy(values, "weight"));
    }
  }, [hierarchyFilters]);

  //autoSort
  useEffect(() => {
    if (positionFilters) {
      setPositionFilters((values) => sortBy(values, "weight"));
    }
  }, [positionFilters]);

  const H5 = <h5 className="mb-2 "></h5>;

  return (
    <>
      <div className="bg-gradient-primary" style={{ height: "200px" }}></div>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1 mb-5" xl="6">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Load file</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <FormGroup>
                      <Button
                        color="primary"
                        disabled={!file}
                        onClick={async (e) => {
                          e.preventDefault();
                          const omit = (key, { [key]: _, ...obj }) => obj;

                          await globalActions.server.POST("/test", {
                            ...file,
                            filters: {
                              hierarchy: hierarchyFilters,
                              position: positionFilters,
                              negative: negativeFilters.split(",").map((x) => {
                                return { value: x.trim() };
                              }),
                            },
                          });
                        }}
                        size="sm"
                      >
                        Calculate!
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="heading-small text-muted">Upload data</h6>
                <Row>
                  <Col>
                    <Form>
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
                    </Form>
                  </Col>
                  <Col>
                    <label className="form-control-label mt-4">Stats</label>
                    {stats && (
                      <div>
                        <h5> Profiles: {stats.lines} </h5>
                        <h5> Companies: {stats.companies} </h5>
                      </div>
                    )}
                  </Col>
                </Row>
                <h6 className="heading-small text-muted">Set filters</h6>

                <Row>
                  <Col>
                    <Row>
                      <Col>
                        {" "}
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Hierarchy (Head, Lead...)
                          </ControlLabel>
                          <DataSheet2
                            data={hierarchyFilters}
                            columns={cols}
                            onChangeData={(modifications) =>
                              setHierarchyFilters(modifications)
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col> selectors </Col>
                    </Row>
                    <Row>
                      <Col>
                        {" "}
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Title (BDR, Sales, Dev Frontend...)
                          </ControlLabel>
                          <DataSheet2
                            data={positionFilters}
                            columns={cols}
                            onChangeData={(modifications) =>
                              setPositionFilters(modifications)
                            }
                          />
                        </FormGroup>{" "}
                      </Col>{" "}
                      <Col> selectors </Col>
                    </Row>
                    <Row>
                      <Col>
                        {" "}
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Negative Scoring
                          </ControlLabel>
                          <Input
                            value={negativeFilters}
                            onChange={(value, event) =>
                              setNegativeFilters(
                                value.replace(/,(\s)?/g, ", ").trim()
                              )
                            }
                            name="negatives"
                            componentClass="textarea"
                            style={{ resize: "auto" }}
                            rows={10}
                          />
                        </FormGroup>
                      </Col>{" "}
                      <Col> selectors </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-2 mb-5" xl="6">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Score filters</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <FormGroup>
                      <Button
                        color="primary"
                        onClick={async (e) => {
                          e.preventDefault();
                        }}
                        size="sm"
                      ></Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted">Target data</h6>
                  <div className=""></div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>{" "}
    </>
  );
};

export default Scoring;
