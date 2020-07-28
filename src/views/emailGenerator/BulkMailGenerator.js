import React, { useEffect, useState } from "react";

import { Input as Uploader } from "rsuite";

import {
  Button,
  ButtonGroup,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col
} from "reactstrap";

import { Loader, Checkbox } from "rsuite";

import DataSheet2, { setRow } from "../../components/Common/DataSheet2";

import { useGlobal } from "../../store";

import axios from "axios";

const BulkEmailGenerator = props => {
  const initCols = React.useMemo(
    () => [
      {
        value: "Name",
        key: "firstName",
        col: 0,
        readOnly: true
      },
      {
        value: "Family Name",
        key: "lastName",
        col: 1,
        readOnly: true
      },
      {
        value: "Domain",
        key: "companyDomain",
        col: 2,
        readOnly: true
      },
      {
        value: "Company",
        key: "companyName",
        col: 3,
        readOnly: true
      },
      {
        value: "Generated",
        key: "generated",
        col: 4,
        readOnly: true,
        readOnlyColumn: true,
        width: "35%"
      },
      {
        value: "Type",
        key: "type",
        col: 5,
        readOnly: true,
        readOnlyColumn: true,
        width: "12%"
      },
      {
        value: "Info",
        key: "info",
        col: 6,
        readOnly: true,
        readOnlyColumn: true,
        width: "10%"
      },
      {
        value: "Source",
        key: "source",
        col: 7,
        readOnly: true,
        readOnlyColumn: true,
        width: "9%"
      }
    ],
    []
  );

  const [globalState, globalActions] = useGlobal();
  const [isDomain, setIsDomain] = useState(true);
  const [skipUnreachable, setSkipUnreachable] = useState(false);
  const [skipFree, setSkipFree] = useState(false);

  const [file, setFile] = useState(false);

  const [cols, setCols] = useState(initCols);
  const [scraperID, setScraperID] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([[], []]);

  //const modifier = (data) => globalActions.generator.setProp("data", data);

  const readFile = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result.split(/base64,/)[1]);
      };
      fileReader.onerror = () => {
        reject(fileReader.error);
      };
      fileReader.readAsDataURL(file);
    });
  };

  const b64DecodeUnicode = str => {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  };

  async function loadFile(event) {
    if (event.target.files) {
      const fileName = event.target.files[0].name;
      try {
        const fileContent = await readFile(event.target.files[0]);
        setData(
          JSON.parse(b64DecodeUnicode(fileContent).replace(/NaN/g, "0")).data
        );
      } catch (error) {
        // Show an error to the user... not a log 😁
        console.log(error);
      }
    }
  }

  const handleGeneratorSuccess = (key, result) => {
    const answer = result;

    setData(data =>
      setRow(data, key, {
        source: answer.bestGuessSource,
        info: answer.bestGuessPattern,
        type: answer.acceptAll ? answer.acceptAll : "Found!",
        generated: answer.bestGuess
      })
    );
    return answer;
  };

  const handleGeneratorError = (key, err, result) => {
    const answer = result
      ? result
      : {
          type: "error",
          message: err ? err.message : "Error"
        };

    setData(data =>
      setRow(data, key, {
        generated: answer.bestGuess,
        type: answer.message,
        source: answer.bestGuessSource,
        info: answer.bestGuessPattern
      })
    );

    return answer;
  };

  useEffect(() => {
    globalActions.generator.setProp("data", data); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <>
      <Row>
        <Col>
          <DataSheet2
            data={globalState.mailGenerator.data}
            columns={cols}
            setIsLoading={setIsLoading}
            onChangeData={modifications => setData(modifications)}
            //onChangeData={(modifications) => setCelus(modifications)}
          />
          {false && (
            <Button
              color="success"
              onClick={() =>
                setRow(
                  modifications => setData(modifications),
                  globalState.mailGenerator.data,
                  1,
                  {
                    domain: "hello",
                    type: "hallo"
                  }
                )
              }
              size="sm"
            >
              tests
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          <FormGroup>
            <label className="form-control-label" htmlFor="input-ID">
              Curiosity scraper
            </label>
            <InputGroup>
              <Input
                id="input-ID"
                type="text"
                placeholder="process ID"
                style={{ maxWidth: "107px" }}
                value={scraperID}
                onChange={e => setScraperID(e.target.value)}
              />
              <InputGroupAddon addonType="prepend">
                <Button
                  id="button-download-json"
                  color="primary"
                  onClick={async () => {
                    const url = await axios.get(
                      "http://ec2-52-47-90-214.eu-west-3.compute.amazonaws.com:5000/get_json_final?id_request=6"
                    );
                    console.log("url", url.data);
                    const { data } = await axios.get(url.data);
                    const hm = await JSON.parse(data.replace(/NaN/g, "0")).data;
                    console.log(hm);
                    console.log([hm[0], hm[1]]);
                    globalActions.generator.setProp("data", hm);
                  }}
                >
                  {`Load Json`}
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <label className="form-control-label mt-4" htmlFor="id">
              Import JSON
            </label>
            <Uploader
              color="primary"
              type="file"
              name="file"
              id="file"
              onChange={async (v, e) => {
                await loadFile(e);
              }}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup className="pull-right mt-4">
            <Checkbox
              checked={skipFree}
              onChange={(e, v) => {
                setSkipFree(value => !value);
              }}
            >
              Skip free checks
            </Checkbox>
            <Checkbox
              checked={skipUnreachable}
              onChange={(e, v) => {
                setSkipUnreachable(value => !value);
              }}
            >
              Dodge errors
            </Checkbox>
            <Checkbox
              checked={isDomain}
              onChange={(e, v) => {
                const newValue = {
                  ...cols[2],
                  value: !isDomain ? "Domain" : "Company",
                  key: !isDomain ? "domain" : "companyName"
                };
                //setCols((cols) => Object.assign([], cols, { 2: newValue }));
                setIsDomain(value => !value);
              }}
            >
              Use domain
            </Checkbox>

            <ButtonGroup>
              <Button
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify({ data: globalState.mailGenerator.data })
                )}`}
                download="table.json"
                color="secondary"
              >
                {`Download JSON`}
              </Button>

              <Button
                color="primary"
                disabled={isLoading}
                onClick={async e => {
                  e.preventDefault();

                  try {
                    const data = globalState.mailGenerator.data;
                    setIsLoading(true);

                    const verifiedEmailsPromise = Promise.all(
                      data.map(async (line, key) => {
                        /*<--- lines without enough data --->*/
                        if (
                          !line.firstName ||
                          !line.lastName ||
                          (!line.companyDomain && !line.companyName)
                        ) {
                          handleGeneratorError(key, { msg: "missing data" });
                          return;
                        }
                        /*<--- lines with enough data --->*/
                        const answer = await globalActions.server.GET(
                          "/generateVerifiedEmail/v2",
                          {
                            ...line,
                            options: {
                              findDomain: !isDomain,
                              ignoreUnreachable: skipUnreachable,
                              ignoreFreeErrors: skipUnreachable,
                              analyzeDomain: !skipFree,
                              generics: !skipFree,
                              freeChecks: !skipFree,
                              checkTool: "debounce", // debounce
                              leadGenTool: "skrappio" //skrappio },
                            }
                          }
                        );

                        console.log("result", answer);
                        const result = answer.res.data;

                        return answer.type === "error"
                          ? handleGeneratorError(key, null, result)
                          : handleGeneratorSuccess(key, result);
                      })
                    );

                    let cancelled = false;
                    (async () => {
                      while (!cancelled) {
                        const logs = await globalActions.server.GET(
                          "/logs/1000"
                        );
                        const logsArr = logs.res.data.logs;
                        if (logsArr !== null) {
                          if (
                            Object.prototype.toString.call(logsArr) ===
                            "[object Array]"
                          ) {
                            logsArr
                              .sort((a, b) =>
                                a.timeStamp < b.timeStamp ? 1 : -1
                              )
                              .map(x => console.log(`${x.level}`, x.message));
                          } else {
                            console.log("Log:", logsArr);
                          }
                        }
                        await new Promise(r => setTimeout(r, 1000)); // 2 second delay
                      }
                    })();

                    const verifiedEmails = await verifiedEmailsPromise;
                    cancelled = true;

                    setIsLoading(false);
                    console.log("finished", verifiedEmails);
                  } catch (err) {
                    setIsLoading(false);
                    console.log(err);
                  }
                }}
              >
                {`Generate email`}
              </Button>
            </ButtonGroup>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default BulkEmailGenerator;
