import React from "react";

import ReactDOM from "react-dom";

import "rsuite/dist/styles/rsuite-default.css";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import {
  objectMap,
  objectFilter,
  StringClean,
  objectFlatten,
} from "./utils/coreHelpers";

import App from "./app";

//Too many errors from dependencies
/*ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);*/

//I live on danger
objectMap();
objectFilter();
StringClean();

ReactDOM.render(<App />, document.getElementById("root"));
