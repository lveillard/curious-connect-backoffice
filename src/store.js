import React from "react";
//import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

import * as actions from "./actions";

const initialState = {
  lastLoginStatus: "",
  loadingLogin: false,
  isLoading: { airtable: false },
  token: "",
  confirmedToken: false,
  gapiAuthed: false,
  config: { hiddenSidebar: false },
  size: { width: 700 },
  readyToSendRecords: [],
};

export const useGlobal = useGlobalHook(React, initialState, actions);
