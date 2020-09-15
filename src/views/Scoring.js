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
  ButtonGroup,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import { Input as RInput, ControlLabel } from "rsuite";

import Select from "react-select";

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

  const [toggleSave, setToggleSave] = useState(false);

  const toggle = () => {
    setToggleSave((toggleSave) => !toggleSave);
  };

  const saveFilters = async (e, name, filters, type = "filterPack") => {
    e.preventDefault();

    try {
      const result = await globalActions.server.POST("/scoring/filters", {
        name,
        filters,
        type,
      });
      console.log("updated/created filter", result);
      //and update the list
      await globalActions.scoring.getFilterPacks();
      toggle();
    } catch (err) {
      console.log(err);
    }
  };

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

  const [filterPackName, setFilterPackName] = useState("Default");
  const [filtersSaveName, setFiltersSaveName] = useState(null);
  const [hierarchyFilters, setHierarchyFilters] = useState(initHierarchy);
  const [positionFilters, setPositionFilters] = useState([{}, {}]);
  const [negativeFilters, setNegativeFilters] = useState("sales");
  const [negativeGenericFilters, setNegativeGenericFilters] = useState(
    "stagiaire"
  );

  const loadFilterPack = () => {
    if (
      !globalState.scoring ||
      !globalState.scoring.filterPacks ||
      !globalState.scoring.filterPacks.length > 0
    ) {
      return false;
    }

    const currentFilterPackName = globalState.scoring.selectedFilterPack.label;

    const currentFilterPack = globalState.scoring.filterPacks.find(
      (x) => x.name === currentFilterPackName
    );

    setHierarchyFilters(currentFilterPack.filters.hierarchy);
    setPositionFilters(currentFilterPack.filters.position);
    setNegativeFilters(
      currentFilterPack.filters.negative.map((x) => x.value).join(", ")
    );
    currentFilterPack.filters.negativeGeneric &&
      setNegativeGenericFilters(
        currentFilterPack.filters.negativeGeneric.map((x) => x.value).join(", ")
      );
    setFilterPackName(currentFilterPackName);
    setFiltersSaveName(currentFilterPackName);
  };

  const [scraperID, setScraperID] = useState("");

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
    globalActions.scoring.getFilterPacks();
  }, []);

  useEffect(() => {
    if (file) {
      console.log("file", file);
      setStats({
        lines: file.data.length,
        companies: new Set(
          file.data.map((x) => x.companyId || x.CompanyID || x.companyID)
        ).size,
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
                        disabled={true}
                        onClick={async (e) => {
                          /*
                          e.preventDefault();
                          const result = await globalActions.server.POST(
                            "/test",
                            {
                              ...file,
                              filters: {
                                hierarchy: hierarchyFilters,
                                position: positionFilters,
                                negative:
                                  negativeFilters +
                                  ", " +
                                  negativeGenericFilters.split(",").map((x) => {
                                    return { value: x.trim() };
                                  }),
                              },
                            }
                          );

                          console.log("result", result);
                          setData(result.res.data.profiles);
                          */
                        }}
                        size="sm"
                      ></Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="heading-small text-muted">Upload data</h6>
                <Row>
                  <Col lg="6">
                    <Form>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="id">
                          Import JSON
                        </label>
                        <Uploader
                          style={{ height: "38px", padding: "5px" }}
                          color="primary"
                          type="file"
                          name="file"
                          id="file"
                          onChange={async (v, e) => {
                            setFile(await loadJson(e));
                            setData(null);
                          }}
                        />
                      </FormGroup>
                    </Form>
                  </Col>
                  <Col lg="6">
                    <Form>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-ID"
                        >
                          Import from Curiosity Scraper
                        </label>

                        <Row>
                          <Col xs="7">
                            <Select
                              id="student_name"
                              placeHolder="Select student"
                              type="text"
                              isDisabled={globalState.isLoading.airtable}
                              isLoading={globalState.isLoading.airtable}
                              isClearable
                              isSearchable
                              onChange={(selected, type) => {
                                globalActions.bulkSender.setCurrentStudent(
                                  selected
                                );
                                if (type.action === "clear")
                                  globalActions.bulkSender.setCurrentStudent(
                                    null
                                  );
                              }}
                              value={globalState.bulkSender.selectedStudent}
                              options={
                                globalState.students &&
                                globalState.students.map((x) => {
                                  return {
                                    value: x.emailSender,
                                    label: x.name + " " + x.familyName,
                                  };
                                })
                              }
                              noOptionsMessage={() =>
                                "You need to load a program with students"
                              }
                              //onChange={(e) => setStudentName(e.target.value)}
                            />
                          </Col>
                          <Col xs="5">
                            <InputGroup>
                              <Input
                                id="input-ID"
                                type="text"
                                placeholder="ID"
                                style={{
                                  textAlign: "center",
                                  textIndent: "-10px",
                                  height: "38px",
                                }}
                                value={scraperID}
                                onChange={(e) => setScraperID(e.target.value)}
                              />

                              <InputGroupAddon addonType="append">
                                <Button
                                  id="button-download-json"
                                  style={{ height: "38px" }}
                                  color="primary"
                                  disabled={
                                    !globalState.bulkSender.currentStudent ||
                                    !scraperID
                                  }
                                  onClick={async () => {
                                    try {
                                      const {
                                        res,
                                      } = await globalActions.server.GET(
                                        `/curiosity/allData/` + scraperID
                                      );
                                      const cleaned = await JSON.parse(
                                        res.data
                                          .replace(/undefined/g, "0")
                                          .replace(/"undefined"/g, "0")
                                          .replace(/NaN/g, "0")
                                      );

                                      console.log("datis", cleaned);
                                      setFile(cleaned);
                                      setData(null);
                                    } catch (err) {
                                      console.log(err);
                                    }
                                  }}
                                >
                                  {`Load`}
                                </Button>
                              </InputGroupAddon>
                            </InputGroup>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
                <h6 className="heading-small text-muted">Stats</h6>
                {stats.lines ? (
                  <Row>
                    <Col>
                      <div>
                        <h5> Profiles: {stats.lines} </h5>
                        <h5> Companies: {stats.companies} </h5>
                        {stats.companies && stats.companies < 25 && (
                          <h5>
                            Required companies on Part I:{" More than "}
                            {Math.floor((25 / stats.companies) * 350)}
                            {" companies"}
                          </h5>
                        )}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col>
                      <h5>
                        You need to import a profile list to see its stats...
                      </h5>
                    </Col>
                  </Row>
                )}

                <h6 className="heading-small text-muted mt-3">Set filters</h6>
                <Row>
                  <Col>
                    <Form>
                      <FormGroup>
                        {globalState.bulkSender.currentStudent && (
                          <Row>
                            <Col>
                              <label className="form-control-label">
                                Student type
                              </label>
                              <h5>
                                {
                                  globalState.bulkSender.currentStudent
                                    .formation
                                }
                              </h5>
                            </Col>
                          </Row>
                        )}
                        <Row>
                          <Col xs={4}>
                            <label className="form-control-label">
                              Filters DB
                            </label>
                          </Col>
                          <Col xs={8}>
                            {toggleSave ? (
                              <InputGroup className="float-right" size="sm">
                                <Input
                                  value={
                                    filtersSaveName === null
                                      ? filterPackName
                                      : filtersSaveName
                                  }
                                  onChange={(e) =>
                                    setFiltersSaveName(e.target.value)
                                  }
                                  placeholder="name of the filter"
                                />
                                <InputGroupAddon addonType="append">
                                  <Button
                                    onClick={async (e) =>
                                      await saveFilters(e, filtersSaveName, {
                                        hierarchy: hierarchyFilters,
                                        position: positionFilters,
                                        negativeGeneric: negativeGenericFilters
                                          .split(",")
                                          .map((x) => {
                                            return { value: x.trim() };
                                          }),
                                        negative: negativeFilters
                                          .split(",")
                                          .map((x) => {
                                            return { value: x.trim() };
                                          }),
                                      })
                                    }
                                    color="success"
                                  >
                                    Save
                                  </Button>
                                </InputGroupAddon>
                                <InputGroupAddon addonType="append">
                                  <Button
                                    onClick={() => {
                                      setFiltersSaveName(null);
                                      toggle();
                                    }}
                                    color="danger"
                                  >
                                    x
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                            ) : (
                              <ButtonGroup className="float-right">
                                <Button
                                  id="button-load-filter"
                                  color="primary"
                                  onClick={loadFilterPack}
                                  size="sm"
                                >
                                  {`Load filter`}
                                </Button>
                                <Button
                                  id="button-save-filter"
                                  color="success"
                                  onClick={toggle}
                                  size="sm"
                                >
                                  {`Save filter`}
                                </Button>
                                <Button
                                  id="button-delete-filter"
                                  color="danger"
                                  onClick={async () => {}}
                                  size="sm"
                                >
                                  {`Delete filter`}
                                </Button>
                              </ButtonGroup>
                            )}
                          </Col>
                        </Row>
                        <Select
                          className="selector mt-2"
                          classNamePrefix="select"
                          //isDisabled={globalState.isLoading.sentRecords}
                          isLoading={!globalState.scoring}
                          value={globalState.scoring.setSelectedFilterPack}
                          isClearable
                          placeHolder="Filters"
                          isSearchable
                          onChange={(selected, type) => {
                            globalActions.scoring.setSelectedFilterPack(
                              selected
                            );
                            if (type.action === "clear")
                              globalActions.scoring.setSelectedFilterPack(null);
                          }}
                          options={
                            globalState.scoring &&
                            globalState.scoring.filterPackList
                          }
                        />
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Hierarchy (Head, Lead...) [Min: 0 || Max: 1]
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
                      <Col lg="6">
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Title (BDR, Sales, Dev Frontend...) [Min: 1 || Max:
                            4]
                          </ControlLabel>
                          <DataSheet2
                            data={positionFilters}
                            columns={cols}
                            onChangeData={(modifications) =>
                              setPositionFilters(modifications)
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Negative Scoring (Generic)
                          </ControlLabel>
                          <RInput
                            value={negativeGenericFilters}
                            onChange={(value, event) =>
                              setNegativeGenericFilters(
                                value.replace(/,(\s)?/g, ", ").trim()
                              )
                            }
                            name="negatives"
                            componentClass="textarea"
                            style={{ resize: "auto" }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <FormGroup>
                          <ControlLabel className="form-control-label">
                            Negative Scoring (Metier)
                          </ControlLabel>
                          <RInput
                            value={negativeFilters}
                            onChange={(value, event) =>
                              setNegativeFilters(
                                value.replace(/,(\s)?/g, ", ").trim()
                              )
                            }
                            name="negatives"
                            componentClass="textarea"
                            style={{ resize: "auto" }}
                            rows={5}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          className="float-right"
                          color="primary"
                          disabled={
                            !file || !positionFilters || !hierarchyFilters
                          }
                          onClick={async (e) => {
                            e.preventDefault();
                            setData(null);

                            // get regular negatives
                            const negatives = negativeFilters
                              .split(",")
                              .map((x) => {
                                return { value: x.trim() };
                              });
                            //get the generic negatives
                            const negativesGenerics = negativeGenericFilters
                              .split(",")
                              .map((x) => {
                                return { value: x.trim() };
                              });

                            //if only the generics are present, ignore them
                            const allNegatives = negativesGenerics.length
                              ? negativesGenerics.concat(negatives)
                              : negatives;

                            const result = await globalActions.server.POST(
                              "/test",
                              {
                                ...file,
                                filters: {
                                  hierarchy: hierarchyFilters,
                                  position: positionFilters,
                                  negative: allNegatives,
                                },
                              }
                            );

                            console.log("result", result);
                            setData(result.res.data.profiles);
                          }}
                        >
                          Calculate!
                        </Button>
                      </Col>
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
                  <Col>
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
                  <Col>
                    <Button
                      className="float-right"
                      color="primary"
                      disabled={!data}
                      href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify({
                          step: "scored",
                          mode: "bo",
                          scraperID: scraperID,
                          record:
                            globalState.bulkSender.currentStudent &&
                            globalState.bulkSender.currentStudent.record,
                          bdCode:
                            globalState.bulkSender.currentStudent &&
                            globalState.bulkSender.currentStudent.bdCode,
                          data: data,
                        })
                      )}`}
                      download={`${
                        globalState.bulkSender.currentStudent &&
                        globalState.bulkSender.currentStudent.bdCode
                      }-scored.json`}
                    >
                      {`Download JSON`}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Scoring;
