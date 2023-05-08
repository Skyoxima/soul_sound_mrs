import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

function ProtectedRoute(props) {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem('token')
        setAuth(token)
        if (!token) {
            navigate("/login")
        }
    }, [])
    return (
        <>
            {props.children}
            {/* {auth ? props.children : <Navigate to={"/login"} />} */}
        </>
    )
}

export default ProtectedRoute