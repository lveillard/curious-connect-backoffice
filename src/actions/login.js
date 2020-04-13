import axios from "axios";

import API from "../utils/API"
import { Alert } from "rsuite"

import React, { useHistory } from "react";
//import React, { useState, useEffect, useContext } from "react";


import { Redirect } from "react-router-dom";






const burl = "https://ccbo.glitch.me";

const post = (email, password) => {
    return axios.post(
        `${burl}/users/login`,
        {
            email,
            password
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};




export const login = async (store, credentials) => {
    const status = "LOADING";
    store.setState({ status });

    if (!localStorage.getItem("token")) {
        try {
            const { data } = await post(credentials.email, credentials.password)
            localStorage.setItem("token", data.token);
            const user = data.user
            store.setState({ user })
            store.setState({ token: data.token });
            store.setState({ confirmedToken: false })
            Alert.success("Logged in!");


        } catch (err) {
            console.log(err);
            Alert.error("Bad credentials!");
            localStorage.clear();
            return false
        }
    }

    try {
        const { data } = await API.isAuth();
        if (data) {
            store.setState({ confirmedToken: true })
            store.setState({ user: data });
            return <Redirect to='/admin' />


        } else {
            Alert.warning("Wrong!");
            localStorage.clear()
            return <Redirect to='/auth' />


        }
    } catch (err) { console.log(err); return false }
};


export const logout = async (store) => {
    const token = localStorage.getItem("token")
    let url = `${burl}/users/me/logout`;
    console.log("logout: el token", token)

    if (!token) { return false } else {

        try {
            axios.post(url, {}, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            })
            localStorage.clear();
        } catch (err) {
            console.log("bad token:", err); localStorage.clear(); return <Redirect to='/auth' />
        }
    }

};

export const getUser = async (store) => {

    const token = localStorage.getItem("token")
    store.setState({ token: token });
    store.setState({ confirmedToken: false })



    if (!token) { Alert.error("You're not logged!"); return false } else {

        try {
            const answer = await axios.get(
                `${burl}/users/me`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                    }
                }
            );

            const { data } = answer
            const user = data;
            console.log("user")
            store.setState({ user });
            store.setState({ confirmedToken: true })
            console.log("store", store.state)
            return <Redirect to='/auth' />

        } catch (err) { console.log("bad token"); localStorage.clear() }
    }










};

