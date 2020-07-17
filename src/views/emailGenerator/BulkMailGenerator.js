import React, { useEffect, useState } from "react";

import { Button, FormGroup, Row, Col } from "reactstrap";

import DataSheet, {
  setCell,
  generateRows,
} from "../../components/Common/DataSheet";

import { useGlobal } from "../../store";

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

  const [globalState, globalActions] = useGlobal();
  const [isDomain, setIsDomain] = useState(true);
  const [columns, setColumns] = useState(columnas);

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

  useEffect(() => {
    /*async function fetchMyAPI() 

    }*/
  });

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
          <FormGroup className="pull-right mt-4">
            <Button
              color="primary"
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

            <Button
              color="danger"
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
                          options: { findDomain: !isDomain },
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
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default BulkEmailGenerator;
