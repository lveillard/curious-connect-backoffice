import React, { useState, useEffect } from "react";
import * as mathjs from "mathjs";

import Datasheet from "react-datasheet";

import "react-datasheet/lib/react-datasheet.css";
import "./dataSheet.css";

export const setCell = (current, changeRow, changeCol, newValue) => {
  const currentCellValue = getCell(current, changeRow, changeCol);
  const newCellValue = { ...currentCellValue, value: newValue };
  const changeRowCorrected = changeRow - 1;
  const result = Object.assign([...current], {
    [changeRowCorrected]: Object.assign([...current[changeRowCorrected]], {
      [changeCol]: newCellValue,
    }),
  });

  return result;
};

export const getCell = (current, row, col) => {
  return current[row - 1][col];
};

export default (props) => {
  const generateRows = (numberOfRows) => {
    const RowVector = Array.from(Array(numberOfRows), (_, i) => i + 1);

    const rows = RowVector.map((row) =>
      props.columns.map((col) => {
        return {
          value: "",
          expr: "",
          row: row,
          col: col.col,
          key: row + ":" + col.col,
          readOnly: col.readOnlyColumn ? true : false,
        };
      })
    );

    return rows;
  };

  /*const generateTable = (columns, numberOfRows) => {
    const table = [columns].concat(generateRows(numberOfRows));

    return table;
  };

  */

  const updateRows = (current, changedRow, changedCol, newValue) => {
    //const RowVector = Array.from(Array(current.length - 1), (_, i) => i + 1);
    const RowVector = Array.from(Array(current.length), (_, i) => i + 1);
    const rows = RowVector.map((r) =>
      props.columns.map((c) => {
        return {
          value:
            c.col === changedCol && r === changedRow
              ? newValue
              : current[r - 1][c.col].value,
          expr: current[r - 1][c.col].expr,
          row: r,
          col: c.col,
          key: r + ":" + c.col,
          readOnly: c.readOnlyColumn ? true : false,
        };
      })
    );
    return rows;
  };

  /*const updateTable = (columns, current, changedRow, changedCol, newValue) => {
    const table = [columns].concat(
      updateRows(current, changedRow, changedCol, newValue)
    );

    return table;
  }; */

  const onCellsChanged = (changes, additions) => {
    //console.log("changes", changes);
    //console.log("additions", additions);

    //if additions > 0 => add columns
    const currentRows = celus.length;
    const lastRow =
      additions && (Math.max(...additions.map((x) => x.row)) || 0);
    const newRows = lastRow - currentRows;

    if (newRows > 0) {
      setCelus((celus) => celus.concat(generateRows(newRows)));

      additions.map((x) =>
        setCelus((celus) => updateRows(celus, x.row, x.col, x.value))
      );
    }

    changes.map((x) =>
      setCelus((celus) => updateRows(celus, x.row, x.col, x.value))
    );
  };

  const initData =
    props.data && props.data.length > 0 ? props.data : generateRows(2);
  const [celus, setCelus] = useState(() => initData);

  const changeParentData = () => {
    props.onChangeData(celus);
  };

  useEffect(() => {
    changeParentData(celus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <>
      <div
        className={"add-button"}
        onClick={() => {
          setCelus((celus) => celus.concat(generateRows(1)));
        }}
      >
        Add row
      </div>

      <Datasheet
        data={[props.columns].concat(props.data)}
        valueRenderer={(cell) => cell.value}
        dataRenderer={(cell) => cell.expr}
        onCellsChanged={onCellsChanged}
      />
    </>
  );
};
