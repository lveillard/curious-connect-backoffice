import React, { useEffect } from "react";

import { useGlobal } from "../../store";

import { MdQueryBuilder, MdDoneAll } from "react-icons/md";

import { NavItem, NavLink, Nav } from "reactstrap";

const BulkViewSelector = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    /*async function fetchMyAPI() {
    }*/
  }, []);

  return (
    <>
      <Nav tabs style={{ background: "transparent" }}>
        <NavItem
          style={{
            borderRight: "solid 1px #2e456c",
            background:
              globalState.subView.bulkEmail === "readyToSend"
                ? "#152849"
                : "#172d52",
            borderTopRightRadius: "6px",
            borderTopLeftRadius: "6px",
            width: "50%",
            textAlign: "center",
            color: "white",
            cursor: "pointer",
            borderNottom:
              globalState.subView.bulkEmail === "readyToSend"
                ? "unset"
                : "2px solid #2e456c",
          }}
        >
          <NavLink
            style={{ height: "48px" }}
            onClick={() => {
              globalActions.config.setSubView("bulkEmail", "readyToSend");
            }}
          >
            <div
              style={{
                color:
                  !(globalState.subView.bulkEmail === "readyToSend") && "#ccc",
                fontSize:
                  globalState.subView.bulkEmail === "readyToSend" && "18px",
                fontWeight:
                  !(globalState.subView.bulkEmail === "readyToSend") && "100",
                transitionDuration: "0.3s",
                paddingTop: "6px",
              }}
            >
              <MdQueryBuilder
                style={{
                  color: "#ffd600",
                  marginBottom: "2px",
                  marginRight: "1px",
                }}
              />{" "}
              To send
            </div>
          </NavLink>
        </NavItem>
        <NavItem
          style={{
            borderLeft: "1px solid #0c1b33",
            background:
              globalState.subView.bulkEmail === "sent" ? "#152849" : "#172d52",
            borderTopRightRadius: "6px",
            borderTopLeftRadius: "6px",
            width: "50%",
            textAlign: "center",
            color: "white",
            cursor: "pointer",
            borderNottom:
              globalState.subView.bulkEmail === "sent"
                ? "unset"
                : "2px solid #2e456c",
          }}
        >
          <NavLink
            style={{ height: "48px" }}
            onClick={() => {
              globalActions.config.setSubView("bulkEmail", "sent");
            }}
          >
            <div
              style={{
                color: !(globalState.subView.bulkEmail === "sent") && "#ccc",
                fontSize: globalState.subView.bulkEmail === "sent" && "18px",
                fontWeight:
                  !(globalState.subView.bulkEmail === "sent") && "100",
                transitionDuration: "0.3s",
                paddingTop: "6px",
              }}
            >
              {" "}
              <MdDoneAll
                style={{
                  color: "#2dce89",
                  marginBottom: "2px",
                  marginRight: "1px",
                }}
              />{" "}
              Sent
            </div>
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
};

export default BulkViewSelector;
