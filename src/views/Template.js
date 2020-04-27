import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

const Template = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
    //globalActions.gapi.load();
  }, []);

  return <></>;
};

export default Template;
