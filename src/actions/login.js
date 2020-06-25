import { SERVER_URL, LOCAL_URL } from "../utils/constants";

import axios from "axios";
import { Alert } from "rsuite";

export const post = (store, email, password) => {
  return axios.post(
    `${store.state.debug.localServer ? LOCAL_URL : SERVER_URL}/users/login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const isAuth = async (store) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  } else {
    try {
      const answer = await axios.get(`${SERVER_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return answer;
    } catch (err) {
      console.log("bad token or user without routes", err);
      localStorage.clear();
    }
  }
};

export const login = async (store, credentials) => {
  const status = "LOADING";
  store.setState({ status });

  if (!localStorage.getItem("token")) {
    try {
      const { data } = await store.actions.login.post(
        credentials.email,
        credentials.password
      );
      localStorage.setItem("token", data.token);
      const user = data.user;
      store.setState({ user });
      store.setState({ token: data.token });
      store.setState({ confirmedToken: false });
      const status = "LOADED";
      store.setState({ status });
      Alert.success("Logged in!");
    } catch (err) {
      console.log(err);
      Alert.error("Bad credentials!");
      const status = "FAILED";
      store.setState({ status });
      localStorage.clear();
      return false;
    }
  }
  try {
    const { data } = await store.actions.login.isAuth();
    if (data) {
      store.setState({ confirmedToken: true });
      store.setState({ user: data });
      const status = "LOADED";
      store.setState({ status });
      return true;
    } else {
      Alert.warning("Wrong!");
      localStorage.clear();
      store.setState({ user: data });
      const status = "WEIRD";
      store.setState({ status });
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const logout = async (store) => {
  const token = localStorage.getItem("token");
  let url = `${SERVER_URL}/users/me/logout`;

  if (!token) {
    return false;
  } else {
    try {
      axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      Alert.success("Logged out!");

      return true;
    } catch (err) {
      console.log("bad token:", err);
      localStorage.clear();
      return false;
    }
  }
};

export const getUser = async (store) => {
  /*store.setState({ count: store.state.count + 1 || 1 });
  console.log("Ciclo:", store.state.count);
  console.log("getUser", store.actions.gapi.gmail());*/

  const token = localStorage.getItem("token");
  store.setState({ token: token });
  store.setState({ confirmedToken: false });

  if (!token) {
    Alert.error("You're no longer logged!");
    return false;
  } else {
    try {
      const answer = await axios.get(
        `${store.state.debug.localServer ? LOCAL_URL : SERVER_URL}/users/me`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const { data } = answer;
      const user = data;
      store.setState({ user });
      store.setState({ confirmedToken: true });

      //initialize gapi + check if already logged in
      console.log("Step A.1", store.actions.gapi.gmail());

      store.actions.gapi.load();
      console.log("Step C.1", store.actions.gapi.gmail());

      return true;
    } catch (err) {
      console.log("bad token:", err);
      localStorage.clear();
    }
  }
};
