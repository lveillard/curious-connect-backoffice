import React from 'react'
import { Route, Redirect } from 'react-router-dom'





const ProtectedRoute = ({ component: Component, ...rest }) => {


    return (
        <Route {...rest} render={
            props => {
                if (localStorage.getItem("token")) {
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




