import React from 'react'

import { IconContext } from "react-icons"; // Used for Styling react-icons
import { Link, useLocation } from "react-router-dom";
import "./SidebarButton.css";

function SidebarButton(props) {
    const location = useLocation(); // used to check which url is currently active
    
    if (location.pathname === "/logout") {
        // window.localStorage.removeItem("token");
        window.localStorage.removeItem("currUser");
        window.localStorage.removeItem("isSignupAuth");
        window.localStorage.removeItem("isLoginAuth");
        window.location = window.location.origin
    }

    const isActive = location.pathname === props.to;
    const btnClass = isActive ? "btn-body active" : "btn-body";

    return (
        <Link to={props.to}>
            <div className={btnClass}>
                <IconContext.Provider value={{ size: "24px", className: "btn-icon" }}>
                    {props.icon}
                    <p className="btn-title">{props.title}</p>
                </IconContext.Provider>
            </div>
        </Link>
    )
}

export default SidebarButton