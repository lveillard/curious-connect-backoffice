import React from "react";
//import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

import * as actions from "./actions";

const initialState = {
  lastLoginStatus: "",
  loadingLogin: false,
  token: "",
  confirmedToken: false,
  gapiAuthed: false,
};

export const useGlobal = useGlobalHook(React, initialState, actions);
