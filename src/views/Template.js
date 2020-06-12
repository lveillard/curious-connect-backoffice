import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";

import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";

import "../assets/css/emailing.css";

//steps:
// 1) Copy template
// 2) Update Admin.js => Import + update variable views
// 3) Update routes in the code server curious-connect-server.herokuapp.com
// 4) grant the route permission to somebody in the mongodb

const Template = () => {
  const [globalState, globalActions] = useGlobal();
  const [senders, setSenders] = useState([]);

  useEffect(() => {
    /*async function fetchMyAPI() {

    }*/
  }, []);

  return (
    <>
      <div>Template</div>
    </>
  );
};

export default Template;
