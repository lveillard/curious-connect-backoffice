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
