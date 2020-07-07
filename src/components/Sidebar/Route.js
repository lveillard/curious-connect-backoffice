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
/*eslint-disable*/
import React, { useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

import { useGlobal } from "../../store";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  UncontrolledCollapse,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

const Route = (props) => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    //console.log("props", props);
  }, []);

  return (
    <React.Fragment>
      {!props.route.children ? (
        <NavItem>
          <NavLink
            to={props.route.layout + props.route.path}
            tag={NavLinkRRD}
            onClick={() =>
              globalActions.config.setConfig("toggledSidebar", false)
            }
            activeClassName="active"
          >
            <i className={props.route.icon} />
            {props.route.name}
          </NavLink>
        </NavItem>
      ) : (
        <>
          <NavItem style={{ cursor: "pointer" }}>
            <NavLink
              id={props.route.name}
              onClick={() => {
                //this.toggleDropdown(props.route.name);
              }}
            >
              <i className={props.route.icon} />
              {props.route.name}
            </NavLink>
          </NavItem>

          <UncontrolledCollapse toggler={"#" + props.route.name}>
            {props.route.children.map((x, key) => {
              return (
                <NavItem key={key}>
                  <NavLink
                    to={x.layout + x.path}
                    tag={NavLinkRRD}
                    onClick={() =>
                      globalActions.config.setConfig("toggledSidebar", false)
                    }
                    activeClassName="active"
                  >
                    <i className={"ml-3 " + x.icon} />
                    {x.name}
                  </NavLink>
                </NavItem>
              );
            })}
          </UncontrolledCollapse>

          {
            //this.state.dropdown[props.route.name]
            //true ? this.createChildren(props.route.children) : null
          }
        </>
      )}
    </React.Fragment>
  );
};
export default Route;
