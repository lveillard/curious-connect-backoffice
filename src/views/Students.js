import React, { useEffect, useState } from "react";

//import { Button } from "reactstrap";

//import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";
import styled from "styled-components";

import "../assets/css/emailing.css";

import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from "react-table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const Students = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  const data = React.useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
      {
        Header: "Column 3",
        accessor: "col3",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div>
        <div className="bg-gradient-info" style={{ height: "80px" }}>
          {" "}
        </div>
        <iframe
          title="students"
          className="airtable-embed"
          src="https://airtable.com/embed/shrCGXdl1svUUbEHp?backgroundColor=purple&viewControls=on"
          width="100%"
          height="810"
          style={{ background: "transparent" }}
        ></iframe>

        <div>
          <Styles>
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>{" "}
          </Styles>
        </div>
        {/* <iframe
          title="airtable"
          className="airtable-embed"
          src="https://airtable.com/embed/shrkxgArNn0Ckw2J1?backgroundColor=purple&viewControls=on"
          frameborder="0"
          onmousewheel=""
          width="100%"
          style={{ background: "transparent", height: "88vh" }}
        ></iframe> */}
      </div>
    </>
  );
};

export default Students;
