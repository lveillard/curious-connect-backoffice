import React, { useEffect } from "react";

import ReactJson from "react-json-view";

const JsonViewer = (props) => {
  return (
    <div
      className="rs-input"
      style={
        props.type === "answer"
          ? {
              backgroundColor:
                props.src.type === "error"
                  ? "rgba(245, 54, 92, 0.05)"
                  : props.src.type === "loading..."
                  ? "rgba(255, 214, 0,0.05)"
                  : "rgba(45, 206, 137,0.05)",
            }
          : {}
      }
    >
      <ReactJson
        name={props.name}
        enableClipboard={
          props.permissions && props.permissions.copy ? true : false
        }
        style={{ overflowX: "auto" }}
        src={props.src}
        onEdit={
          (props.permissions && props.permissions.edit) === true
            ? (e) => props.onChangeJSON(e)
            : false
        }
        onAdd={
          (props.permissions && props.permissions.add) === true
            ? (e) => props.onChangeJSON(e)
            : false
        }
        onDelete={
          (props.permissions && props.permissions.delete) === true
            ? (e) => props.onChangeJSON(e)
            : false
        }
        collapsed={props.collapsed}
      />
    </div>
  );
};

export default JsonViewer;
