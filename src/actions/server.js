import { SERVER_URL, LOCAL_URL } from "../utils/constants";
import axios from "axios";

export const POST = async (store, url) => {};

export const GET = async (store, dir, local) => {
  const token = localStorage.getItem("token");
  try {
    const answer = await axios.get((!local ? SERVER_URL : LOCAL_URL) + dir, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return { res: answer, type: "success" };
  } catch (err) {
    console.log("bad token or user without routes", err);
    return { res: err.message, type: "error" };
  }
};
