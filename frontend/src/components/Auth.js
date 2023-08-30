import React, { useEffect, useState } from "react";
import { AUTH_TABS } from "../constants";
import Tabs from "./Tabs";
import Login from "./Login";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Register from "./Register";

const Auth = () => {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/auth') {
          navigate('/auth/login')
        }
    }, [location.pathname])

    return(
        <><Tabs /><Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
        </Routes></>

    );
};
export default Auth;