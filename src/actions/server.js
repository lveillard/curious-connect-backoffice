import { SERVER_URL, LOCAL_URL } from "../utils/constants";
import axios from "axios";

export const POST = async (store, url) => {};

export const GET = async (store, dir, local, params) => {
  const token = localStorage.getItem("token");

  console.log("params,", params, typeof params);

  //to-do find a way to do this inmmutably
  var json = {};

  if (typeof params !== "object") {
    json = params ? JSON.parse(params) : {};
  } else {
    json = params;
  }

  var config = {
    method: "get",
    url: (!local ? SERVER_URL : LOCAL_URL) + dir,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    params: json,
  };

  try {
    const answer = await axios(config);
    return {
      res: answer,
      type: answer.data.type || "success",
      status:
        (answer.res && answer.res.status) || answer.status || "status error",
      message:
        answer.data && answer.data.type === "error"
          ? answer.data.message
          : "it worked!",
    };
  } catch (err) {
    console.log("Error response:", err.response);
    console.log("bad token or user without routes", err);
    return {
      res: err.response,
      status: err.response.status,
      message: err.response.data.message,
      type: "error",
    };
  }
};

export const isAvailable = async (store, local) => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 1000, "Request timed out");
  });

  const request = await store.actions.server.GET("/test", local);

  return Promise.race([timeout, request])
    .then((response) => {
      const old = store.state.server;
      const modified = {
        ...old,
        status: {
          local: local ? true : old.status.local,
          server: local ? old.status.server : true,
        },
      };
      store.setState({ server: modified });
    })
    .catch((error) => {
      const old = store.state.server;
      const modified = {
        ...old,
        status: {
          local: local ? false : old.status.local,
          server: local ? old.status.server : false,
        },
      };
      store.setState({ server: modified });
    });
};
