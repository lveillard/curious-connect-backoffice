/*eslint-disable*/
import React, { useEffect, useState } from "react";
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
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
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

import Select from "react-select";

import MenuToggle from "../Navbars/MenuToggle";
import AlertsToggle from "../Navbars/AlertsToggle";

import Route from "./Route";

var ps;
let logo = {
  innerLink: "/admin/index",
  imgSrc: "/images/logo3.png",
  imgAlt: "...",
};

const Sidebar = () => {
  const [globalState, globalActions] = useGlobal();
  const location = useLocation();

  useEffect(() => {
    globalActions.airtable.getPrograms();
  }, []);

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
      style={{
        boxShadow: "50px 0 5px 5px #333 !important",
        borderColor: "rgba(0,0,0,.05)",
        borderTopColor: "rgba(0, 0, 0, 0.05)",
        borderRightColor: "rgba(0, 0, 0, 0.05)",
        borderBottomColor: "rgba(0, 0, 0, 0.05)",
        borderLeftColor: "rgba(0, 0, 0, 0.05)",
        borderStyle: "solid",
      }}
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => globalActions.config.setConfig("toggledSidebar")}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" to={logo.innerLink} tag={Link}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}

        {/*Program selector*/}
        {
          // if you don't have access to any program => then there is no select
          globalState.programs && (
            <Container
              style={
                globalState.config.size.width >= 768
                  ? {
                      width: "100%",
                      padding: "0px",
                    }
                  : { width: "60%" }
              }
            >
              {" "}
              {/* Disabled while loading sentRecords or they will override asynchronously */}
              <Select
                className="selector"
                classNamePrefix="select"
                isDisabled={globalState.isLoading.sentRecords}
                isLoading={false}
                value={globalState.currentProgram}
                isClearable
                placeHolder="Programs"
                isSearchable
                onChange={(selected, type) => {
                  globalActions.routes.setCurrentProgram(selected);
                  if (type.action === "clear")
                    globalActions.routes.setCurrentProgram(null);
                }}
                options={globalState.programs}
              />
            </Container>
          )
        }

        {/* User */}
        <Nav className="align-items-center d-md-none">
          <AlertsToggle />
          <MenuToggle sidebar />
        </Nav>

        {/* Collapse */}

        <Collapse navbar isOpen={globalState.config.toggledSidebar}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {/*Logo*/}
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  <Link to={logo.innerLink}>
                    <img alt={logo.imgAlt} src={logo.imgSrc} />
                  </Link>
                </Col>
              ) : null}

              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={() =>
                    globalActions.config.setConfig("toggledSidebar")
                  }
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Navigation */}
          <Nav navbar>
            {globalState.user.routes.map((route, key) => (
              <Route key={key} route={route} />
            ))}
          </Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          <h6 className="navbar-heading text-muted">Documentation</h6>
          {/* Navigation */}
          <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink
                href={"#"}
                onClick={() => {
                  window.open(
                    "https://www.notion.so/CC-Wiki-1e3e780bc83a45d19bff0e761efdc036",
                    "_blank"
                  );
                }}
              >
                <i className="ni ni-spaceship" />
                WIKI{" "}
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
