import React, { useEffect, useState } from "react";

import { Button, FormGroup, ButtonGroup, Row, Col } from "reactstrap";

import { Loader, Checkbox } from "rsuite";

import DataSheet2, { setRow } from "../../components/Common/DataSheet2";

import { useGlobal } from "../../store";

const BulkEmailGenerator = (props) => {
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
        value: "Company",
        key: "company",
        col: 3,
        readOnly: true,
      },
      {
        value: "Generated",
        key: "generated",
        col: 4,
        readOnly: true,
        readOnlyColumn: true,
        width: "35%",
      },
      {
        value: "Type",
        key: "type",
        col: 5,
        readOnly: true,
        readOnlyColumn: true,
        width: "12%",
      },
      {
        value: "Info",
        key: "info",
        col: 6,
        readOnly: true,
        readOnlyColumn: true,
        width: "10%",
      },
      {
        value: "Source",
        key: "source",
        col: 7,
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
  const [skipFree, setSkipFree] = useState(false);

  const [cols, setCols] = useState(initCols);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([[], []]);

  //const modifier = (data) => globalActions.generator.setProp("data", data);

  const handleGeneratorSuccess = (key, result) => {
    const answer = result;

    setData((data) =>
      setRow(data, key, {
        source: answer.bestGuessSource,
        info: answer.bestGuessPattern,
        type: answer.acceptAll ? answer.acceptAll : "Found!",
        generated: answer.bestGuess,
      })
    );
    return answer;
  };

  const handleGeneratorError = (key, err, result) => {
    const answer = result
      ? result
      : {
          type: "error",
          message: err ? err.message : "Error",
        };

    setData((data) =>
      setRow(data, key, {
        generated: answer.bestGuess,
        type: answer.message,
        source: answer.bestGuessSource,
        info: answer.bestGuessPattern,
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
            onChangeData={(modifications) => setData(modifications)}
            //onChangeData={(modifications) => setCelus(modifications)}
          />
          <Button
            color="success"
            onClick={() =>
              setRow(
                (modifications) => setData(modifications),
                globalState.mailGenerator.data,
                1,
                {
                  domain: "hello",
                  type: "hallo",
                }
              )
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
              checked={skipFree}
              onChange={(e, v) => {
                setSkipFree((value) => !value);
              }}
            >
              Skip free checks
            </Checkbox>
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
                //setCols((cols) => Object.assign([], cols, { 2: newValue }));
                setIsDomain((value) => !value);
              }}
            >
              Use domain
            </Checkbox>

            <Button
              color="primary"
              disabled={isLoading}
              onClick={async (e) => {
                e.preventDefault();

                try {
                  const data = globalState.mailGenerator.data;
                  setIsLoading(true);

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
                            ignoreFreeErrors: skipUnreachable,
                            analyzeDomain: !skipFree,
                            generics: !skipFree,
                            freeChecks: !skipFree,
                            checkTool: "debounce", // debounce
                            leadGenTool: "skrappio", //skrappio },
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
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default BulkEmailGenerator;
