import React, { useEffect } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { chulaSSO } from './api/login'

function Auth() {
    const { search } = useLocation();
    const history = useHistory();

    // redirect when login with chulaSSO
    useEffect(() => {
        chulaSSO(search).then(response => {
            console.log(response)
            history.push('/')
            window.location.reload();
        }).catch(e => {
            console.log(e.message.data)
            history.push({
                pathname: '/login',
                state: { err: 'Cannot sign in with ChulaSSO.' },
            })
        })
    }, [])

    return (<p>waiting</p>)
}

export default Auth;