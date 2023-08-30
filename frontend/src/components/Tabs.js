import React, { useState } from "react";
import { AUTH_TABS } from "../constants";
import { useNavigate } from "react-router-dom";

const Tabs = (props) => {
    const [activeTab, setActiveTab] = useState(AUTH_TABS.SIGN_IN);
    const navigate = useNavigate();

    return(
        <div className="tabs">
            <div className={activeTab===AUTH_TABS.SIGN_IN ? "active-tab" : "inactive-tab"}
                onClick={() => {setActiveTab(AUTH_TABS.SIGN_IN);
                    navigate('/auth/login')}}>
                <h3>{AUTH_TABS.SIGN_IN}</h3>
            </div>
            <div className={activeTab===AUTH_TABS.REGISTER ? "active-tab" : "inactive-tab"}
                onClick={() => {setActiveTab(AUTH_TABS.REGISTER);
                    navigate('/auth/register')}}>
                <h3>{AUTH_TABS.REGISTER}</h3>
            </div>
        </div>
    );
};
export default Tabs;
