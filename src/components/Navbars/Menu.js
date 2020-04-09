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
import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

import {
  useHistory,
} from "react-router-dom";

import { useGlobal } from "../../store";

const Menu = () => {

  let history = useHistory();
  const [globalState, globalActions] = useGlobal();


  function logout() {

    globalActions.logout();
    history.replace("/");

  }

  return (

    <React.Fragment>
      <DropdownMenu className="dropdown-menu-arrow" right>
        <DropdownItem className="noti-title" header tag="div">
          <h7 style={{ color: "black" }} className="text-overflow m-0">Welcome!</h7>
        </DropdownItem>
        <DropdownItem disabled to="/admin/user-profile" tag={Link}>
          <i className="ni ni-single-02" />
          <span>My profile</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem href="#" onClick={e => e.preventDefault(), logout}>
          <i className="ni ni-button-power" />
          <span>Logout</span>
        </DropdownItem>
      </DropdownMenu>

    </React.Fragment>


  );

}



export default Menu;
