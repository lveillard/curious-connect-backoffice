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
      <Nav tabs syle={{ background: "transparent" }}>
        <NavItem
          style={{
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
            background:
              globalState.subView.bulkEmail === "sent" ? "#152849" : "#172d52",
            borderRight: "solid 1px #5e72e4",
            borderTopRightRadius: "6px",
            borderTopLeftRadius: "6px",
            width: "50%",
            textAlign: "center",
            color: "white",
            cursor: "pointer",
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
