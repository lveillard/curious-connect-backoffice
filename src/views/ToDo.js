import React, { useEffect, useState } from "react";

import { Card, Container } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

const ToDo = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div className="bg-gradient-success" style={{ height: "200px" }}>
        {" "}
      </div>
      <Container className="mt--5" fluid>
        <Card>
          <li> Bulk email sender </li>
          <li> Permissions by component: protected component </li>
          <li> Todo view </li>
          <li> Airtable data: retrieve from express and not client</li>
          <li> Make candidate view for formatrices</li>
        </Card>
      </Container>
    </>
  );
};

export default ToDo;
