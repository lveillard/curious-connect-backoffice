import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useGlobal } from "./store";

import ProtectedRoute from "./protectedRoute";
import AdminLayout from "layouts/Admin.js";
import Login from "layouts/Login.js";

const App = () => {
  const [globalState, globalActions] = useGlobal();

  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    function handleResize() {
      const size = getSize();
      globalActions.config.setSize(size);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth" render={(props) => <Login {...props} />} />
        <Redirect from="/auth/defaultsite" to="/auth" />
        <ProtectedRoute path="/admin" component={<AdminLayout />} />
        <Redirect from="/" to="/admin/index" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
