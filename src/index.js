import React from "react";

import ReactDOM from "react-dom";

import "rsuite/dist/styles/rsuite-default.css";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import App from "./app";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
