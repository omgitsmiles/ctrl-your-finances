import React from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/Context";

const Protected = ({children}) => {
    const { user } = AppContext();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default Protected;