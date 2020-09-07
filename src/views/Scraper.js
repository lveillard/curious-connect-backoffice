import React, { useEffect, useState } from "react";

//import { Button } from "reactstrap";

//import EmailHeader from "components/Headers/EmailHeader.js";

import { useGlobal } from "../store";
import styled from "styled-components";

const Scraper = () => {
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
          title="scraper"
          className="curiosity-scraper"
          src="http://ec2-52-47-90-214.eu-west-3.compute.amazonaws.com:5000/"
          width="100%"
          height="810"
          style={{ background: "transparent" }}
        ></iframe>
      </div>
    </>
  );
};

export default Scraper;
