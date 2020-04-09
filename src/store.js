import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

const initialState = {
    isAuthenticated: false
};

const actions = {

    login: (store, id) => {

        const oldValue = store.state.isAuthenticated;
        store.setState({ isAuthenticated: !oldValue });
        console.log(store.state.isAuthenticated)
    },
    logout: (store, id) => {

        const oldValue = store.state.isAuthenticated;
        store.setState({ isAuthenticated: !oldValue });
        console.log(store.state.isAuthenticated)
    }
};

export const useGlobal = useGlobalHook(React, initialState, actions);
