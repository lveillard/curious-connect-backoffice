import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import { Form, Navbar, Nav, Container } from "reactstrap";

import Menu from "./MenuToggle";

import { useGlobal } from "../../store";

const AdminNavbar = (props) => {
  return (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Container fluid>
        <Link
          className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          to="/"
        >
          {props.brandText}
        </Link>
        {/* just for moving the icon to the right */}
        <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"></Form>
        <Nav className="align-items-center d-none d-md-flex" navbar>
          <Menu />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
