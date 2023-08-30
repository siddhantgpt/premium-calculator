import React, { useEffect, useState } from "react";
import SelectionPanel from "./SelectionPanel";
import { SELECTION_TAB } from "../constants";
import MyPolicies from "./MyPolicies";
import NewPolicy from "./NewPolicy";
import MyProfile from "./MyProfile";
import ChangePassword from "./ChangePassword";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PolicySummary from "./PolicySummary";

const AppContent = () => {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/app') {
          navigate('/app/my-policies')
        }
    }, [location.pathname])

    return(
        <div className="App-container">
            <SelectionPanel/>
            <Routes>       
                <Route path="my-policies" element={<MyPolicies />} />
                <Route path="new-policy" element={<NewPolicy />} />
                <Route path="my-profile" element={<MyProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="policy-summary" element={<PolicySummary/>} />
            </Routes>
        </div>
    );
};
export default AppContent;