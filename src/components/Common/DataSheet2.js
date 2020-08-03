import React, { useState, useEffect, useCallback, useRef } from "react";

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

var ENTER_KEY = 13;
var TAB_KEY = 9;
var ESCAPE_KEY = 27;

export const addRows = (data, nRows) => {
  return data.concat(
    [...Array(parseInt(nRows)).keys()].map((x) => {
      return {};
    })
  );
};

export const delRows = (data, rows) => {
  return data.filter((x, i) => i < rows[0] - 1 || i > rows[1] - 1);
};

export const resetRows = () => {
  return [...Array(parseInt(2)).keys()].map((x) => []);
};

export const setRow = (data, row, modifications) => {
  const newData = data.map((r, i) => {
    return row === i ? { ...r, ...modifications } : r;
  });
  return newData;
};

export const getRow = (data, row) => {
  console.log(data[row]);
};

export default (props) => {
  const [totalRows, setTotalRows] = useState("");
  const [selected, setSelected] = useState();
  const sheetRef = useRef(null);

  useEffect(() => {
    if (props.data) {
      setTotalRows(props.data.length);
    }
  }, [props.data]);

  // the MainEditor
  const MainEditor = (otherProps) => {
    const [state, setState] = useState("");
    //console.log("otherProps", otherProps);

    const handleKeyDown = (e) => {
      const { onCommit, onRevert } = otherProps;
      // record last key pressed so we can handle enter
      if (e.shiftKey && e.which === ENTER_KEY) {
        //add new row
        e.persist();
        setState({ e });
        onCommit(otherProps.value, e);
        if (otherProps.row === totalRows) {
          props.onChangeData((data) => addRows(data, 1));
        }
        setSelected({
          start: { i: otherProps.row + 1, j: 0 },
          end: { i: otherProps.row + 1, j: 0 },
        });
      } else if (e.which === ENTER_KEY || e.which === TAB_KEY) {
        e.persist();
        setState({ e });
        onCommit(otherProps.value, e);
      } else if (e.which === ESCAPE_KEY) {
        onCommit(otherProps.value, e);
      } else {
        setState({ e: null });
      }
    };

    const handleChange = (opt) => {
      //console.log("opt", opt);
      const { onCommit, onRevert } = otherProps;
      if (!opt) {
        return onRevert();
      }
      const { e } = state;
      otherProps.onChange(opt.target.value);
      //onCommit(opt.target.value, e);
      //console.log("COMMITTED", opt.target.value);
    };

    return (
      <input
        value={otherProps.value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{ width: "100%" }}
      />
    );
  };

  const updateCells = (old, changes, add = false) => {
    //get rows that have been updated
    const updatedRows = [...new Set(changes.map((item) => item.row))];

    if (add) {
      const getAddedRows = (changes) => {
        return updatedRows.map((row) =>
          changes
            .filter((change) => change.row === row)
            .reduce((obj, item) => {
              return {
                ...obj,
                [props.columns.find((column) => column.col === item.col).key]:
                  item.value,
              };
            }, {})
        );
      };
      props.onChangeData((data) => data.concat(getAddedRows(changes)));
    } else {
      //this applies the changes to a particular row
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

      // props.onChangeData is a function i'm passing as prop: is actually just a setYOURVARIABLENAME hook (useState())
      // if is one of the modified change it, if not, let it as it was
      props.onChangeData(
        old.map((row, i) =>
          updatedRows.includes(i + 1)
            ? { ...row, ...getModifiedPerRow(i + 1, changes) }
            : row
        )
      );
    }
  };

  const onCellsChange = (changes, additions) => {
    props.setIsLoading && props.setIsLoading(true);
    const old = props.data;
    updateCells(old, changes);
    additions && updateCells(old, additions, true);
    props.setIsLoading && props.setIsLoading(false);
    console.log("additions", additions);
  };

  const [newRows, setNewRows] = useState(2);

  const handleUserKeyPress = useCallback(
    (event) => {
      const { keyCode, ctrlKey } = event;

      if (ctrlKey && keyCode === 189 && props.data.length > 0) {
        event.preventDefault();
        props.onChangeData((data) =>
          delRows(data, [selected.start.i, selected.end.i])
        );
        console.log("selected", selected);
        setSelected({
          start: { i: selected.start.i - 1, j: 0 },
          end: { i: selected.end.i - 1, j: 0 },
        });
      } else if (event.shiftKey && event.which === ENTER_KEY) {
        if (selected.end.i === totalRows) {
          setSelected((selected) => {
            return {
              start: { i: selected.end.i + 1, j: 0 },
              end: { i: selected.end.i + 1, j: 0 },
            };
          });
          props.onChangeData((data) => addRows(data, 1));
        }
      }
    },
    [selected]
  );

  useEffect(() => {
    sheetRef.current &&
      sheetRef.current.addEventListener("keydown", handleUserKeyPress);

    return () => {
      sheetRef.current &&
        sheetRef.current.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

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
      {props.controls && (
        <Row style={{ marginBottom: "20px" }}>
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
                    props.onChangeData((data) => addRows(data, newRows));
                  }
                }}
              />
              <InputGroupAddon addonType="append">
                <Button
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onChangeData((data) => addRows(data, newRows));
                  }}
                  onSubmit={(e) => e.preventDefault()}
                  className={"add-button"}
                >
                  <b>Add</b>
                </Button>
                <Button
                  color="info"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onChangeData((data) =>
                      data.filter((x) => Object.keys(x).length !== 0)
                    );
                  }}
                  onSubmit={(e) => e.preventDefault()}
                  className={"add-button"}
                >
                  <b>Clean</b>
                </Button>
                <Button
                  color="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onChangeData((data) => resetRows(data));
                  }}
                  onSubmit={(e) => e.preventDefault()}
                  className={"add-button"}
                >
                  <b>Reset</b>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>{" "}
        </Row>
      )}

      <Row>
        {" "}
        <Col>
          <div ref={sheetRef}>
            <Datasheet
              data={[props.columns].concat(
                prepareData(props.data, props.columns)
              )}
              valueRenderer={(cell) => cell.value}
              dataRenderer={(cell) => cell.expr}
              onCellsChanged={onCellsChange}
              dataEditor={props.dataEditor || MainEditor}
              selected={selected}
              onSelect={(selected) => setSelected(selected)}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};
