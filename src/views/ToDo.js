import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

const ToDo = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
    //globalActions.gapi.load();
  }, []);

  return (
    <>
      <li> Bulk email sender </li>
      <li> Permissions by component: protected component </li>
      <li> Todo view </li>
      <li> Airtable data: retrieve from express and not client</li>
      <li> Make candidate view for formatrices</li>
    </>
  );
};

export default ToDo;