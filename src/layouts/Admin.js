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

import { Loader, Panel } from "rsuite";

import { useGlobal } from "../store";

const Admin = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    async function fetchMyAPI() {
      await globalActions.login.getUser();
    }
    fetchMyAPI();
  }, [globalActions.login]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  });

  const mainContent = useRef();
  const location = useLocation();

  const views = {
    TimeLine: TimeLine,
    Profile: Profile,
    Tools: Tools,
  };
  const getRouteName = () => {
    if (globalState.user) {
      try {
        //TO-DO not working with children routes
        return globalState.user.routes.find(
          (x) => x.layout + x.path === location.pathname
        ).name;
      } catch (err) {
        // while loading location.pathname is incomplete so we will get some errors
        // console.log("No rute name")
      }
    }
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
          <Sidebar
            routes={globalState.user.routes}
            logo={{
              innerLink: "/admin/index",
              imgSrc: "/images/logo3.png",
              imgAlt: "...",
            }}
          />
          <div
            className="main-content"
            style={{ background: "#f7fafc" }}
            ref={mainContent}
          >
            <AdminNavbar brandText={getRouteName()} />
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
