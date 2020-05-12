import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

np; //steps:
// 1) Copy template
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the server https://glitch.com/edit/#!/ccbo?path=routes%2Froutes.js%3A1%3A0
// 4) grant the route permission to somebody in the mongodb

const Template = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
    //globalActions.gapi.load();
  }, []);

  return (
    <>
      <div>Template</div>
    </>
  );
};

export default Template;
