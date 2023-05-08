import { useState, useEffect } from "react";

function UseAuth() {
    const [isLoginAuth, setIsLoginAuth] = useState(false);
    const [isSignupAuth, setIsSignupAuth] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoginAuth(localStorage.getItem("isLoginAuth"));
        }
    }, []);
    return (
        [
            isLoginAuth, isSignupAuth
        ]
    )
}

export default UseAuth