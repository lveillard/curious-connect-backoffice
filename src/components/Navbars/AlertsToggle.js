/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect } from "react";
// reactstrap components
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useHistory } from "react-router-dom";

import { useGlobal } from "../../store";

const AlertsToggle = () => {
  let history = useHistory();
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {}, []);

  async function logout(e) {
    e.preventDefault();
    let answer = await globalActions.login.logout();
    if (answer) {
      history.replace("/");
    } else {
    }
  }

  return (
    <UncontrolledDropdown nav>
      <DropdownToggle nav className="nav-link-icon">
        <i className="ni ni-bell-55" />
      </DropdownToggle>
      <DropdownMenu
        aria-labelledby="navbar-default_dropdown_1"
        className="dropdown-menu-arrow"
        right
      >
        <DropdownItem>Action</DropdownItem>
        <DropdownItem>Another action</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Something else here</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default AlertsToggle;
