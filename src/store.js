import React from "react";
//import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

import * as actions from "./actions";

const initialState = {
  lastLoginStatus: "",
  loadingLogin: false,
  bulkSender: {
    currentStudent: null,
    selectedStudent: null,
  },
  isLoading: {
    airtable: false,
    readyToSendRecords: false,
    sentRecords: false,
    bounceChecker: false,
    bulkSender: false,
  },
  isProcessing: {
    bounceChecker: { current: 0, total: 100 },
    bulkSender: { current: 0, total: 100 },
  },
  token: "",
  currentProgram: null,
  confirmedToken: false,
  gapiAuthed: false,
  config: { toggledSidebar: false, hiddenSidebar: false, size: { width: 700 } },
  sentRecords: [],
  sentMetrics: { companies: 0, bounced: 0, sentCount: 0, limits: 0 },
  subView: { bulkEmail: "readyToSend" },
  mailGenerator: { emailList: [], bulkData: [], data: [] },
  readyToSendRecords: [],
  readyToSendConfig: {
    atLeastOneSelected: false,
    atLeastOneReady: false,
    sendersChecked: false,
  },
  server: { status: { local: false, server: false } },
  templates: [],
  debug: { localServer: false },
};

export const useGlobal = useGlobalHook(React, initialState, actions);
