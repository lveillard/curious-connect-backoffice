import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


import ProtectedRoute from "./protectedRoute"
import AdminLayout from "layouts/Admin.js";
import Login from "layouts/Login.js"

import { useGlobal } from "./store";




const App = () => {



    return (
        <BrowserRouter>
            <Switch>
                <Route path="/auth" render={props => <Login {...props} />} />
                <ProtectedRoute path="/admin" component={<AdminLayout />} />
                <Redirect from="/" to="/admin/index" />
            </Switch>
        </BrowserRouter>)

}

export default App;
