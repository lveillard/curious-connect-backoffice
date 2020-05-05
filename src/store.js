import React from "react";
//import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

import * as actions from "./actions";

const initialState = {
  lastLoginStatus: "",
  loadingLogin: false,
  isLoading: { airtable: false, readyToSendRecords: false, sentRecords: false },
  token: "",
  confirmedToken: false,
  gapiAuthed: false,
  config: { hiddenSidebar: false, size: { width: 700 } },
  sentRecords: [],
  sentMetrics: { companies: 0, bounced: 0, sentCount: 0 },
  subView: { bulkEmail: "readyToSend" },
  readyToSendRecords: [],
  readyToSendConfig: {
    atLeastOneSelected: false,
    atLeastOneReady: false,
    sendersChecked: false,
  },
};

export const useGlobal = useGlobalHook(React, initialState, actions);
