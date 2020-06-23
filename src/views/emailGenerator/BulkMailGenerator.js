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
    ],
    []
  );

  const [celus, setCelus] = useState(generateRows(columns, 2));
  //const [key, setKey] = useState(0);
  //const [bestGuess, setBestGuess] = useState("");
  //const col = 3;

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
              color="primary"
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

                  let answer = await globalActions.server.GET(
                    "/generateEmail/bulk",
                    {
                      data,
                    }
                  );

                  let result = answer.res.data;
                  console.log(result);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {`Generate combinations`}
            </Button>

            <Button
              color="primary"
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

                  //now that we have the datasheet data we can loop it

                  // eslint-disable-next-line no-unused-vars
                  let verifiedEmails = await Promise.all(
                    data.map(async (line, key) => {
                      //for (const [key, line] of data.entries()) {
                      if (!line.name || !line.familyName || !line.domain) {
                        return false;
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
                      const bestGuess = result.bestGuess.join(",");
                      console.log("result:", result);

                      setCelus((celus) =>
                        setCell(celus, key + 1, 3, bestGuess)
                      );
                    })
                  );
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
