import React, { useHistory } from "react";
//import React, { useState, useEffect, useContext } from "react";

import useGlobalHook from "use-global-hook";
import { Alert } from 'rsuite'

import { Redirect } from "react-router-dom";

import API from "./utils/API"

import * as actions from "./actions";


const initialState = {
    lastLoginStatus: "",
    token: "",
    confirmedToken: "",
    counter: 0,

};





const test = {

    addCount: (store) => {

        let oldValue = store.state.counter
        store.setState({ counter: oldValue + 1 })

    },





    // helpers
    setLoading: (store, item, value) => {
        store.setState({ isLoading: { ...store.state.isLoading, [item]: value } });
    },

    setAuthed: (store) => {
        store.setState({ autenticao: true })
    },





    //DB
    getTimeline: (store) => {

        fetch(`https://jsonplaceholder.typicode.com/users`)
            // We get the API response and receive data in JSON format...
            .then(response => response.json())
            // ...then we update the users state
            .then(data => store.setState({ TimeLine: { ...store.state.isLoading, isLoading: false, data: data } })
            )
            // Catch any errors we hit and update the app
            .catch(error => store.setState({ error, isLoading: false }));
    },

};

export const useGlobal = useGlobalHook(React, initialState, actions);
