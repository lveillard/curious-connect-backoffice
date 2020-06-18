import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";

import { useGlobal } from "../store";

const Template = () => {
  const [globalState, globalActions] = useGlobal();

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
