import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";

const initialState = {
    isLogged: false
};

const actions = {

    login: (store, id) => {
        const oldValue = store.state.isLogged;
        store.setState({ isLogged: !oldValue });
    }
};

export const useGlobal = useGlobalHook(React, initialState, actions);
