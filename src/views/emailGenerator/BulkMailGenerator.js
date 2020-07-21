import React, { useEffect, useState } from "react";

import { Button, FormGroup, ButtonGroup, Row, Col } from "reactstrap";

import { Loader, Checkbox } from "rsuite";

import DataSheet, {
  setCell,
  generateRows,
} from "../../components/Common/DataSheet";

import DataSheet2, { setRow } from "../../components/Common/DataSheet2";

import { useGlobal } from "../../store";
import { setLocalServer } from "actions/server";

const BulkEmailGenerator = (props) => {
  const columnas = React.useMemo(
    () => [
      {
        value: "Name",
        row: 0,
        col: 0,
        readOnly: true,
      },
      {
        value: "Family Name",
        row: 0,
        col: 1,
        readOnly: true,
      },
      {
        value: "Domain",
        row: 0,
        col: 2,
        readOnly: true,
      },
      {
        value: "Generated",
        row: 0,
        col: 3,
        readOnly: true,
        readOnlyColumn: true,
        width: "35%",
      },
      {
        value: "Type",
        row: 0,
        col: 4,
        readOnly: true,
        readOnlyColumn: true,
        width: "12%",
      },
      {
        value: "Info",
        row: 0,
        col: 5,
        readOnly: true,
        readOnlyColumn: true,
        width: "10%",
      },
      {
        value: "Source",
        row: 0,
        col: 6,
        readOnly: true,
        readOnlyColumn: true,
        width: "9%",
      },
    ],
    []
  );

  const initCols = React.useMemo(
    () => [
      {
        value: "Name",
        key: "name",
        col: 0,
        readOnly: true,
      },
      {
        value: "Family Name",
        key: "familyName",
        col: 1,
        readOnly: true,
      },
      {
        value: "Domain",
        key: "domain",
        col: 2,
        readOnly: true,
      },
      {
        value: "Generated",
        key: "generated",
        col: 3,
        readOnly: true,
        readOnlyColumn: true,
        width: "35%",
      },
      {
        value: "Type",
        key: "type",
        col: 4,
        readOnly: true,
        readOnlyColumn: true,
        width: "12%",
      },
      {
        value: "Info",
        key: "info",
        col: 5,
        readOnly: true,
        readOnlyColumn: true,
        width: "10%",
      },
      {
        value: "Source",
        key: "source",
        col: 6,
        readOnly: true,
        readOnlyColumn: true,
        width: "9%",
      },
    ],
    []
  );

  const [globalState, globalActions] = useGlobal();
  const [isDomain, setIsDomain] = useState(true);
  const [skipUnreachable, setSkipUnreachable] = useState(false);

  const [columns, setColumns] = useState(columnas);

  const [cols, setCols] = useState(initCols);

  const [isLoading, setIsLoading] = useState(false);

  const [celus, setCelus] = useState(generateRows(columns, 2));
  //const [key, setKey] = useState(0);
  //const [bestGuess, setBestGuess] = useState("");
  //const col = 3;

  const modifier = (data) => globalActions.generator.setProp("data", data);

  const handleGeneratorSuccess = (key, result) => {
    const answer = result;

    setRow(modifier, globalState.mailGenerator.data, key, {
      source: answer.bestGuessSource,
      info: answer.bestGuessPattern,
      type: answer.acceptAll ? answer.acceptAll : "Found!",
      generated: answer.bestGuess,
    });

    if (answer.acceptAll) {
      setCelus((celus) => setCell(celus, key + 1, 3, answer.bestGuess));
      setCelus((celus) => setCell(celus, key + 1, 4, answer.acceptAll));
      setCelus((celus) => setCell(celus, key + 1, 5, answer.bestGuessPattern));
      setCelus((celus) => setCell(celus, key + 1, 6, answer.bestGuessSource));
    } else {
      setCelus((celus) => setCell(celus, key + 1, 3, answer.bestGuess));
      setCelus((celus) => setCell(celus, key + 1, 4, "Found!"));
      setCelus((celus) => setCell(celus, key + 1, 5, answer.bestGuessPattern));
      setCelus((celus) => setCell(celus, key + 1, 6, answer.bestGuessSource));
    }
    return answer;
  };

  const handleGeneratorError = (key, err, result) => {
    const answer = result
      ? result
      : {
          type: "error",
          message: err ? err.message : "Error",
        };
    setCelus((celus) => setCell(celus, key + 1, 4, answer.message));
    setCelus((celus) => setCell(celus, key + 1, 5, answer.bestGuessPattern));
    setCelus((celus) => setCell(celus, key + 1, 6, answer.bestGuessSource));
    return answer;
  };

  useEffect(() => {
    globalActions.generator.setProp("bulkData", celus); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celus]);

  return (
    <>
      <Row>
        <Col>
          <DataSheet
            data={globalState.mailGenerator.bulkData}
            onChangeData={(modifications) => setCelus(modifications)}
            columns={columns}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <DataSheet2
            data={globalState.mailGenerator.data}
            columns={cols}
            setIsLoading={setIsLoading}
            onChangeData={modifier}
            //onChangeData={(modifications) => setCelus(modifications)}
          />
          <Button
            color="success"
            onClick={() =>
              setRow(modifier, globalState.mailGenerator.data, 1, {
                domain: "hello",
                type: "hallo",
              })
            }
            size="sm"
          >
            tests
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup className="pull-right mt-4">
            <Checkbox
              checked={skipUnreachable}
              onChange={(e, v) => {
                setSkipUnreachable((value) => !value);
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
                  key: !isDomain ? "domain" : "companyName",
                };
                setCols((cols) => Object.assign([], cols, { 2: newValue }));
                setIsDomain((value) => !value);
              }}
            >
              Use domain
            </Checkbox>

            <ButtonGroup>
              <Button
                color="warning"
                onClick={async (e) => {
                  setSkipUnreachable((value) => !value);
                }}
                size="sm"
              >
                {skipUnreachable
                  ? "Toggle stop when unreachable"
                  : "Toggle skip unreachable"}
              </Button>
              <Button
                color="warning"
                onClick={async (e) => {
                  setIsDomain((value) => !value);
                  const newValue = {
                    ...columns[2],
                    value: isDomain ? "Company" : "Domain",
                  };
                  setColumns((columnas) =>
                    Object.assign([], columnas, { 2: newValue })
                  );
                }}
                size="sm"
              >
                {isDomain ? "Toggle company name" : "Toggle domain"}
              </Button>
            </ButtonGroup>

            {false && (
              <Button
                color="primary"
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    const data = globalState.mailGenerator.bulkData.map((x) => {
                      return {
                        name: x[0].value,
                        familyName: x[1].value,
                        [isDomain ? "domain" : "companyName"]: x[2].value,
                      };
                    });

                    const verifiedEmails = await Promise.all(
                      data.map(async (line, key) => {
                        /*<--- lines without enough data --->*/
                        if (
                          !line.name ||
                          !line.familyName ||
                          (!line.domain && !line.companyName)
                        ) {
                          handleGeneratorError(key, { msg: "missing data" });
                          return;
                        }
                        /*<--- lines with enough data --->*/
                        const answer = await globalActions.server.GET(
                          "/generateVerifiedEmail/v2",
                          {
                            ...line,
                            activePostVariator: true,
                            options: {
                              findDomain: !isDomain,
                              ignoreUnreachable: skipUnreachable,
                            },
                          }
                        );

                        console.log("result", answer);
                        const result = answer.res.data;

                        return answer.type === "error"
                          ? handleGeneratorError(key, null, result)
                          : handleGeneratorSuccess(key, result);
                      })
                    );
                    console.log("finished", verifiedEmails);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                {`Generate probable email`}
              </Button>
            )}

            <Button
              color="primary"
              onClick={async (e) => {
                e.preventDefault();

                try {
                  const data = globalState.mailGenerator.data;

                  const verifiedEmails = await Promise.all(
                    data.map(async (line, key) => {
                      /*<--- lines without enough data --->*/
                      if (
                        !line.name ||
                        !line.familyName ||
                        (!line.domain && !line.companyName)
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
                          },
                        }
                      );

                      console.log("result", answer);
                      const result = answer.res.data;

                      return answer.type === "error"
                        ? handleGeneratorError(key, null, result)
                        : handleGeneratorSuccess(key, result);
                    })
                  );
                  console.log("finished", verifiedEmails);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {`Generate email`}
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default BulkEmailGenerator;
