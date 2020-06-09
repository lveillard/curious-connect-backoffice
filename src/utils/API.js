import { SERVER_URL } from "../utils/constants";

import axios from "axios";
const headers = {
  "Content-Type": "application/json",
};
const burl = SERVER_URL;

export default {
  login: function (email, password) {
    return axios.post(
      `${burl}/users/login`,
      {
        email,
        password,
      },
      {
        headers: headers,
      }
    );
  },
  signup: function (send) {
    return axios.post(`${burl}/user/signup`, send, { headers: headers });
  },

  isAuth: async function () {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    } else {
      try {
        const answer = await axios.get(`${burl}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        return answer;
      } catch (err) {
        console.log("bad token");
        localStorage.clear();
      }
    }
  },
  logout: async function () {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    } else {
      try {
        const answer = await axios.post(`${burl}/users/me/logout`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        return answer;
      } catch (err) {
        console.log("bad token");
        localStorage.clear();
      }
    }
  },
};
