import React, { useRef, useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import TimeLine from "../views/TimeLine";
import Profile from "../views/examples/Profile";
import Tools from "../views/Tools";
import BulkEmail from "../views/BulkEmail";
import ToDo from "../views/ToDo";

import "../assets/css/admin.css";

import { Loader, Panel } from "rsuite";
import { BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";

import { useGlobal } from "../store";

const Admin = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    async function fetchMyAPI() {
      await globalActions.login.getUser();
    }
    fetchMyAPI();
  }, [globalActions.login]);

  //scroll to top only when the route changes
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, []);

  const mainContent = useRef();
  const location = useLocation();

  //when location changes, change route and scroll top
  useEffect(() => {
    globalActions.routes.setRoute(location);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const views = {
    TimeLine: TimeLine,
    Profile: Profile,
    Tools: Tools,
    BulkEmail: BulkEmail,
    ToDo: ToDo,
  };

  const getRoutes = () => {
    if (globalState.user) {
      //children
      let childrenRoutes = globalState.user.routes
        .filter((x) => x.children)
        .map((x) => x.children)[0];

      let mainRoutes = globalState.user.routes;

      let allRoutes = mainRoutes
        .concat(childrenRoutes)
        .filter((x) => x !== undefined);

      return allRoutes
        .filter((x) => x.layout === "/admin")
        .map((x, key) => {
          return (
            <Route
              path={x.layout + x.path}
              component={views[x.component]}
              key={key}
            />
          );
        });
    }
  };
  return (
    <>
      {globalState.user && globalState.user.routes ? (
        <React.Fragment>
          {/*sidebar props?*/}

          {(!globalState.config.hiddenSidebar ||
            globalState.config.size.width <= 767) && (
            <Sidebar
              routes={globalState.user.routes}
              logo={{
                innerLink: "/admin/index",
                imgSrc: "/images/logo3.png",
                imgAlt: "...",
              }}
            />
          )}

          <div
            className="main-content"
            style={{ background: "#f7fafc" }}
            ref={mainContent}
          >
            <AdminNavbar
              brandText={globalActions.routes.getRouteName(location)}
            />

            {globalState.config.size.width > 767 &&
              !globalState.config.hiddenSidebar && (
                <div className="sideclose">
                  <BsBoxArrowLeft
                    onClick={() => globalActions.config.toggleSidebar()}
                  />{" "}
                </div>
              )}

            {globalState.config.size.width > 767 &&
              globalState.config.hiddenSidebar && (
                <div className="sideopen">
                  <BsBoxArrowRight
                    onClick={() => globalActions.config.toggleSidebar()}
                  />{" "}
                </div>
              )}

            <Switch>
              {getRoutes(globalState.user.routes)}
              <Redirect from="*" to="/admin/index" />
            </Switch>
            <Container fluid>
              <AdminFooter />
            </Container>
          </div>
        </React.Fragment>
      ) : (
        <div ref={mainContent}>
          <div
            style={{
              background: "#2c3e50",
            }}
          >
            <Panel style={{ textAlign: "center", color: "white" }}>
              <Loader
                style={{ color: "white" }}
                content="Loading..."
                vertical
              />
            </Panel>
          </div>
          );
        </div>
      )}
    </>
  );
};

export default Admin;
