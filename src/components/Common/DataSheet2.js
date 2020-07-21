import React, { useState, useEffect } from "react";

import Datasheet from "react-datasheet";

import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from "reactstrap";

import "react-datasheet/lib/react-datasheet.css";
import "./dataSheet.css";

export const addRows = (modifier, data, nRows) => {
  modifier(data.concat([...Array(parseInt(nRows)).keys()].map((x) => [])));
};

export const resetRows = (modifier) => {
  modifier([...Array(parseInt(2)).keys()].map((x) => []));
};

export const setRow = (modifier, data, row, modifications) => {
  console.log("data", data);
  console.log("modifications", modifications);
  console.log("row", row);

  const newData = data.map((r, i) => {
    return row === i ? { ...r, ...modifications } : r;
  });
  modifier(newData);
};

export const getRow = (data, row) => {
  console.log(data[row]);
};

export default (props) => {
  const updateCells = (old, changes) => {
    //get updated rows
    const updatedRows = [...new Set(changes.map((item) => item.row))];

    const getModifiedPerRow = (row, changes) => {
      return changes
        .filter((x) => x.row === row)
        .reduce((obj, item) => {
          return {
            ...obj,
            [props.columns.find((column) => column.col === item.col).key]:
              item.value,
          };
        }, {});
    };

    // if is one of the modified change it, if not, let it as it was
    props.onChangeData(
      old.map((row, i) =>
        updatedRows.includes(i + 1)
          ? { ...row, ...getModifiedPerRow(i + 1, changes) }
          : row
      )
    );
  };

  const onCellsChange = (changes, aditions) => {
    props.setIsLoading(true);
    const old = props.data;
    updateCells(old, changes);
    props.setIsLoading(false);
  };

  const [newRows, setNewRows] = useState(2);

  useEffect(() => {
    //init with 2 lines if empty
    (!props.data || props.data.length === 0) && resetRows(props.onChangeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prepareData = (data, columns) => {
    return data.map((y, i) =>
      columns.map((x) => {
        return {
          value: data[i][x.key],
          readOnly: x.readOnlyColumn ? true : false,
        };
      })
    );
  };

  return (
    <>
      <Row style={{ marginTop: "50px", marginBottom: "20px" }}>
        <Col> </Col>
        <Col style={{ maxWidth: "200px" }} xs={5}>
          <InputGroup>
            <Input
              type="number"
              className={"add-button"}
              value={newRows}
              onChange={(e) => setNewRows(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addRows(props.onChangeData, props.data, newRows);
                }
              }}
            />
            <InputGroupAddon addonType="append">
              <Button
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  addRows(props.onChangeData, props.data, newRows);
                }}
                onSubmit={(e) => e.preventDefault()}
                className={"add-button"}
              >
                Add
              </Button>
              <Button
                color="danger"
                onClick={(e) => {
                  e.preventDefault();
                  resetRows(props.onChangeData);
                }}
                onSubmit={(e) => e.preventDefault()}
                className={"add-button"}
              >
                Reset
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>{" "}
      </Row>

      <Row>
        {" "}
        <Col>
          {" "}
          <Datasheet
            data={[props.columns].concat(
              prepareData(props.data, props.columns)
            )}
            valueRenderer={(cell) => cell.value}
            dataRenderer={(cell) => cell.expr}
            onCellsChanged={onCellsChange}
          />
        </Col>
      </Row>
    </>
  );
};
