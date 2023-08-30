import React, { useEffect, useState } from "react";
import { SELECTION_TAB } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";

const SelectionPanel = () => {

    const [selectedTab, setSelectedTab] = useState(SELECTION_TAB.POLICIES);
    const navigate = useNavigate();
    const location = useLocation();

    console.log(location.pathname)
    useEffect(() => {
        switch (location.pathname) {
            case '/app/my-policies':
                setSelectedTab(SELECTION_TAB.POLICIES);
                break;
            case '/app/new-policy':
                setSelectedTab(SELECTION_TAB.CREATE_POLICY);
                break;
            case '/app/my-profile':
                setSelectedTab(SELECTION_TAB.PROFILE);
                break;
            case '/app/change-password':
                setSelectedTab(SELECTION_TAB.CHANGE_PASSWORD);
                break;
            default:
                setSelectedTab("")
        }
    }, [location.pathname]);

    return(
        <div className="Selection-panel">
            <div className= {selectedTab === SELECTION_TAB.POLICIES ? "Selection-tab-active" : "Selection-tab"}
                onClick={() => {setSelectedTab(SELECTION_TAB.POLICIES);
                    navigate('/app/my-policies')}}>
                {SELECTION_TAB.POLICIES}
            </div>
            <div className= {selectedTab === SELECTION_TAB.CREATE_POLICY ? "Selection-tab-active" : "Selection-tab"}
                onClick={() => {setSelectedTab(SELECTION_TAB.CREATE_POLICY);
                    navigate('/app/new-policy')}}>
                {SELECTION_TAB.CREATE_POLICY}
            </div>
            <div className= {selectedTab === SELECTION_TAB.PROFILE ? "Selection-tab-active" : "Selection-tab"}
                onClick={() => {setSelectedTab(SELECTION_TAB.PROFILE);
                    navigate('/app/my-profile')}}>
                {SELECTION_TAB.PROFILE}
            </div>
            <div className= {selectedTab === SELECTION_TAB.CHANGE_PASSWORD ? "Selection-tab-active" : "Selection-tab"}
                onClick={() => {setSelectedTab(SELECTION_TAB.CHANGE_PASSWORD);
                    navigate('/app/change-password')}}>
                {SELECTION_TAB.CHANGE_PASSWORD}
            </div>
        </div>
    );    
};
export default SelectionPanel;