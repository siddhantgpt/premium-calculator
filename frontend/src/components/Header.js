import React, { useEffect, useState } from "react";
import { getTokenExpiryTime, getUserName, isLoggedIn, logOutUser } from "../helper/AuthHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
 
const Header = () => {
    const [showConfirmLogoutModal, setConfirmLogoutModal] = useState(false);
    const [showExpiryModal, setExpiryModal] = useState(false);

    const navigate = useNavigate();
    const displayName = getUserName() || "Guest";

    let expiryCheckInterval = null;

    const checkTokenExpiry = () => {
        if (new Date().getTime() > getTokenExpiryTime()) {
            setExpiryModal(true);
            setConfirmLogoutModal(false);
            logOutUser();
        }
    }
    
    useEffect(() => {
        expiryCheckInterval = setInterval(() => {
            checkTokenExpiry();
        }, 60000);

        return () => clearInterval(expiryCheckInterval);
    }, []);

    useEffect(() => {
        if (!isLoggedIn()) navigate('/auth/login');
    }, [isLoggedIn()]);

    return(
        <div className="Header">
            <h1 className="Title">
                All Assure Insurance
            </h1>
            <div className="User-details">
                <h4 style={{margin: "auto"}}>{"Hello! " + displayName}</h4>
                {isLoggedIn() && <FontAwesomeIcon 
                        color="red"
                        size="xl"
                        icon={faPowerOff}
                        onClick={() => setConfirmLogoutModal(true)}
                    />}
            </div>
            {showConfirmLogoutModal && <Modal
                icon={faPowerOff}
                message={"Are you sure you want to logout?"}
                onConfirm={() => {logOutUser();
                    setConfirmLogoutModal(false)}}
                closeable={true}
                onCancel={() => setConfirmLogoutModal(false)}/>
            }
            {showExpiryModal && <Modal icon={faPowerOff}
                message={"Session Expired. Please login again."}
                closeable={false}
                onConfirm={() => {setExpiryModal(false)}}
            />}
        </div>
    );
};
export default Header;