import React from "react";
//import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

import * as actions from "./actions";

const initialState = {
  lastLoginStatus: "",
  loadingLogin: false,
  isLoading: {
    airtable: false,
    readyToSendRecords: false,
    sentRecords: false,
    bounceChecker: false,
    bulkSender: false,
  },
  token: "",
  currentProgram: null,
  confirmedToken: false,
  gapiAuthed: false,
  config: { toggledSidebar: false, hiddenSidebar: false, size: { width: 700 } },
  sentRecords: [],
  sentMetrics: { companies: 0, bounced: 0, sentCount: 0, limits: 0 },
  subView: { bulkEmail: "readyToSend" },
  mailGenerator: { emailList: [] },
  readyToSendRecords: [],
  readyToSendConfig: {
    atLeastOneSelected: false,
    atLeastOneReady: false,
    sendersChecked: false,
  },
  templates: [],
};

export const useGlobal = useGlobalHook(React, initialState, actions);
