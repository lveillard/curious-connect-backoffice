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

const flatten = (object, prefix = "") =>
  Object.keys(object).reduce(
    (prev, element) =>
      object[element] &&
      typeof object[element] === "object" &&
      !Array.isArray(object[element])
        ? { ...prev, ...flatten(object[element], `${prefix}${element}.`) }
        : { ...prev, ...{ [`${prefix}${element}`]: object[element] } },
    {}
  );

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

  const [scored, setScored] = useState({ profiles: [] });
  const [data, setData] = useState();

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

  const ResultCols = React.useMemo(
    () => [
      {
        value: "Name",
        key: "fullName",
        col: 0,
        readOnly: true,
        readOnlyColumn: true,
      },
      {
        value: "Full Position",
        key: "fullPosition",
        col: 1,
        readOnly: true,
        readOnlyColumn: true,
        width: "50%",
      },
      {
        value: "Company",
        key: "companyName",
        col: 1,
        readOnly: true,
        readOnlyColumn: true,
      },
      {
        value: "Score",
        key: "scoring.total",
        col: 1,
        readOnly: true,
        readOnlyColumn: true,
        width: "8%",
      },
    ],
    []
  );

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
          <Col className="order-xl-1 mb-5" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Load file</h3>
                  </Col>
                  <Col className="text-right" xs="12">
                    <FormGroup>
                      <Button
                        color="primary"
                        disabled={
                          !file || !positionFilters || !hierarchyFilters
                        }
                        onClick={async (e) => {
                          e.preventDefault();
                          const result = await globalActions.server.POST(
                            "/test",
                            {
                              ...file,
                              filters: {
                                hierarchy: hierarchyFilters,
                                position: positionFilters,
                                negative: negativeFilters
                                  .split(",")
                                  .map((x) => {
                                    return { value: x.trim() };
                                  }),
                              },
                            }
                          );

                          console.log("result", result);
                          setData(result.res.data.profiles);
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
        </Row>
        <Row>
          <Col className="order-xl-2 mb-5" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">Results</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <FormGroup></FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted">Top 50 results</h6>
                  <div className=""></div>
                </Form>
                <Row>
                  {" "}
                  <Col>
                    {" "}
                    {data && (
                      <FormGroup>
                        <ControlLabel className="form-control-label">
                          Top 50
                        </ControlLabel>
                        <DataSheet2
                          data={data.slice(0, 50).map((x) => {
                            return { ...x, "scoring.total": x.scoring.total };
                          })}
                          columns={ResultCols}
                        />
                      </FormGroup>
                    )}
                  </Col>
                </Row>
                <Row>
                  {" "}
                  <Col>
                    {" "}
                    <Button
                      className="float-right"
                      color="primary"
                      href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify({
                          step: "scored",
                          mode: "bo",
                          data: data,
                        })
                      )}`}
                      download="scored.json"
                    >
                      {`Download JSON`}
                    </Button>{" "}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>{" "}
    </>
  );
};

export default Scoring;
