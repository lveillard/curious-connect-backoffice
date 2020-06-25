import React, { useEffect, useState } from "react";

import { Checkbox } from "rsuite";
import { Button, FormGroup, Row, Col } from "reactstrap";

import DataSheet, {
  setCell,
  getCell,
  generateRows,
} from "../../components/Common/DataSheet";

import { useGlobal } from "../../store";

const BulkEmailGenerator = (props) => {
  const [globalState, globalActions] = useGlobal();

  const columns = React.useMemo(
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
        width: "15%",
      },
      {
        value: "Info",
        row: 0,
        col: 5,
        readOnly: true,
        readOnlyColumn: true,
        width: "10%",
      },
    ],
    []
  );

  const [celus, setCelus] = useState(generateRows(columns, 2));
  //const [key, setKey] = useState(0);
  //const [bestGuess, setBestGuess] = useState("");
  //const col = 3;

  const handleGeneratorSuccess = (key, result) => {
    const answer = result;

    if (answer.acceptAll) {
      setCelus((celus) => setCell(celus, key + 1, 4, "accept all"));
    } else {
      setCelus((celus) => setCell(celus, key + 1, 3, answer.bestGuess));
      setCelus((celus) => setCell(celus, key + 1, 4, "Found!"));
      setCelus((celus) => setCell(celus, key + 1, 5, answer.bestGuessPattern));
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
    return answer;
  };

  useEffect(() => {
    globalActions.generator.setProp("bulkData", celus); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celus]);

  useEffect(() => {
    /*async function fetchMyAPI() 

    }*/
  });

  return (
    <>
      {" "}
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
          <FormGroup className="pull-right mt-4">
            <Button
              color="danger"
              onClick={async (e) => {
                e.preventDefault();

                try {
                  const data = globalState.mailGenerator.bulkData.map((x) => {
                    return {
                      name: x[0].value,
                      familyName: x[1].value,
                      domain: x[2].value,
                    };
                  });

                  const verifiedEmails = await Promise.all(
                    data.map(async (line, key) => {
                      /*<--- lines without enough data --->*/
                      if (!line.name || !line.familyName || !line.domain) {
                        handleGeneratorError(key, { msg: "missing data" });
                        return;
                      }
                      /*<--- lines with enough data --->*/
                      const answer = await globalActions.server.GET(
                        "/generateVerifiedEmail/v2",
                        {
                          ...line,
                          activePostVariator: true,
                        }
                      );

                      console.log("result", answer);
                      const result = answer.res.data;

                      return answer.type === "error"
                        ? handleGeneratorError(key, result)
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

            <Button
              color="primary"
              disabled={true}
              onClick={async (e) => {
                e.preventDefault();

                try {
                  const data = globalState.mailGenerator.bulkData.map((x) => {
                    return {
                      name: x[0].value,
                      familyName: x[1].value,
                      domain: x[2].value,
                    };
                  });

                  const verifiedEmails = await Promise.all(
                    data.map(async (line, key) => {
                      if (!line.name || !line.familyName || !line.domain) {
                        const answer = {
                          type: "error",
                          message: "Missing data",
                        };
                        setCelus((celus) =>
                          setCell(celus, key + 1, 4, answer.message)
                        );
                        return answer;
                      }

                      //console.log("dataki", data[key]);
                      const answer = await globalActions.server.GET(
                        "/generateVerifiedEmail",
                        {
                          ...line,
                          activePostVariator: true,
                        }
                      );

                      const result = answer.res.data;

                      if (answer.type === "error") {
                        console.log("holi", result);
                        setCelus((celus) =>
                          setCell(celus, key + 1, 4, result.message)
                        );
                        return result;
                      }

                      const bestGuess = result.bestGuess.join(",");

                      console.log("result:", {
                        ...result,
                        line: JSON.stringify(line),
                      });

                      //adding best guess
                      setCelus((celus) =>
                        setCell(celus, key + 1, 3, bestGuess)
                      );

                      //adding info
                      setCelus((celus) =>
                        setCell(
                          celus,
                          key + 1,
                          4,
                          result.helpers.acceptAll
                            ? "Accept All"
                            : result.helpers.needRetry
                            ? "Retry"
                            : result.helpers.formats
                            ? result.helpers.formats
                            : "Got 0 info"
                        )
                      );

                      return result;
                    })
                  );

                  /*
                  const paidwhoisArray = verifiedEmails.map(
                    (x) => x.helpers && x.helpers.checked.payedWhois
                  );
                  */

                  //adding one in the array and removing it at the end for avoiding type error

                  /* const payedEmails =
                    [1, ...paidwhoisArray].reduce((a, b) => a + b, 0) - 1;
                  const formatsArray = verifiedEmails.map(
                    (x) => x.helpers && x.helpers.formats
                  );*/

                  console.log("finished", verifiedEmails);
                  /*
                  console.log("payedWhois:", payedEmails);
                  console.log("formatsUsed:", formatsArray);*/
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {`Generate probable email`}
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default BulkEmailGenerator;
