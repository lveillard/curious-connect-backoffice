import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useGlobal } from "./store";



const ProtectedRoute = ({ component: Component, ...rest }) => {

    const [globalState, globalActions] = useGlobal();
    const isAuthenticated = globalState.isAuthenticated;

    return (
        <Route {...rest} render={
            props => {
                if (true) {
                    return { ...Component, props: props, rest: rest }
                } else {
                    return <Redirect to={
                        {
                            pathname: '/auth',
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
        } />
    )
}


export default ProtectedRoute;




