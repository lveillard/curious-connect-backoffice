import { SERVER_URL, LOCAL_URL } from "../utils/constants";
import axios from "axios";

export const setLocalServer = (store, value) => {
  store.setState({
    debug: {
      ...store.state.debug,
      localServer: value ? value : !store.state.debug.localServer,
    },
  });
};

export const POST = async (store, dir, body, local) => {
  const localServer = local || store.state.debug.localServer;
  const token = localStorage.getItem("token");

  const config = {
    method: "post",
    url: (localServer ? LOCAL_URL : SERVER_URL) + dir,
    data: { body },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  try {
    await axios(config);
  } catch (err) {
    console.log("axios post error", err);
  }
};

export const GET = async (store, dir, params, local) => {
  // if local is present, override the global debug.localSerer
  const localServer = local || store.state.debug.localServer;
  const token = localStorage.getItem("token");
  //to-do find a way to do this inmmutably
  var json = {};

  if (typeof params !== "object") {
    json = params ? JSON.parse(params) : {};
  } else {
    json = params;
  }

  const config = {
    method: "get",
    url: (localServer ? LOCAL_URL : SERVER_URL) + dir,
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
      req: json,
    };
  } catch (err) {
    console.log("Error response:", err.response);
    console.log("bad token or user without routes", err);
    return {
      res: err.response,
      status: err.response && err.response.status,
      message: err.response && err.response.data.message,
      type: "error",
    };
  }
};

//this one should be the only one using local as param
// as it is actually independent from gloabal param debug.localServer
export const isAvailable = async (store, local) => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 1000, "Request timed out");
  });

  const request = await store.actions.server.GET(
    "/ping",
    { mode: "ping" },
    local
  );

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
