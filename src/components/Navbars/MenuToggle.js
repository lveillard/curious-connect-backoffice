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
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
} from "reactstrap";

import { useHistory } from "react-router-dom";

import { useGlobal } from "../../store";

const MenuToggle = (props) => {
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
      {props.siderbar ? (
        <DropdownToggle nav>
          <Media className="align-items-center">
            <span className="avatar avatar-sm rounded-circle">
              <img alt="..." src={"/images/logo3.png"} />
            </span>
          </Media>
        </DropdownToggle>
      ) : (
        <DropdownToggle className="pr-0" nav>
          <Media className="align-items-center">
            <span className="avatar avatar-sm rounded-circle">
              <img alt="..." src={"/images/logo3.png"} />
            </span>
            <Media className="ml-2 d-none d-lg-block">
              <span className="mb-0 text-sm font-weight-bold">
                {globalState.user && globalState.user.name}
              </span>
            </Media>
          </Media>
        </DropdownToggle>
      )}

      <DropdownMenu className="dropdown-menu-arrow" right>
        <DropdownItem className="noti-title" header tag="div">
          <div style={{ color: "black" }} className="text-overflow m-0">
            Welcome {globalState.user && globalState.user.name} !
          </div>
        </DropdownItem>
        <DropdownItem disabled to="/admin/user-profile" tag={Link}>
          <i className="ni ni-single-02" />
          <span>My profile</span>
        </DropdownItem>
        <DropdownItem onClick={() => console.log(globalState)}>
          <i className="ni ni-sound-wave" />
          <span>State</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem href="#" onClick={(e) => logout(e)}>
          <i className="ni ni-button-power" />
          <span>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default MenuToggle;
