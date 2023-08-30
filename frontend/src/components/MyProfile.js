import React, { useEffect, useState } from "react";
import { SELECTION_TAB } from "../constants";
import { request } from "../helper/AxiosHelper";
import { faXmark, faFloppyDisk, faInfoCircle, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import Loader from "./Loader";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from "../helper/RegexHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserId, isLoggedIn } from "../helper/AuthHelper";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
    const [isLoading, setLoading] = useState(true);
    const [originalUserData, setOriginalUserData] = useState({});
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [isValidName, setValidName] = useState(true);
    const [nameFocus, setNameFocus] = useState(false);
    const [email, setEmail] = useState("");
    const [isValidEmail, setValidEmail] = useState(true);
    const [emailFocus, setEmailFocus] = useState(false);
    const [phone, setPhone] = useState(null);
    const [isValidPhone, setValidPhone] = useState(true);
    const [phoneFocus, setPhoneFocus] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [showCancelModal, setCancelModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSaveSuccessModal, setSaveSuccessModal] = useState(false);
    const [showSaveFailedModal, setSaveFailedModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) navigate('/auth/login');
        else getProfileData();
    }, []);

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone));
    }, [phone])

    const getProfileData = async () => {
        setLoading(true);
        await request(
            "GET",
            "api/get-profile",
            null,
            {
                user_id: getUserId()
            }).then(
            (response) => {
                const data = response?.data;
                setOriginalUserData(data);
                setUserId(data.user_id);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
            }).catch(
            (error) => {
                console.log("FAILED")
                
            }
        );
        setLoading(false);
    };

    const saveChanges = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        if(isValidName && isValidEmail && isValidPhone) {
            await request(
                "POST",
                "/api/save-profile",
                {
                    user_id: getUserId(),
                    name,
                    email,
                    phone,
                }
            ).then((response) => { 
                setEditMode(false);
                setSaveSuccessModal(true)})
            .catch((error) => {setSaveFailedModal(true)});
            getProfileData();
        };
        setLoading(false);
    };

    const  isFormDirty = () => {
        if (name === originalUserData.name 
            && email === originalUserData.email 
            && phone === originalUserData.phone) return false;
        else return true;
    }

    const cancelEditing = () => {
        setEditMode(false);
        setName(originalUserData.name);
        setEmail(originalUserData.email);
        setPhone(originalUserData.phone);
    }

    return(
        <div className="Selected-content">
            {isLoading ? <Loader/> : 
            <>
                <h2>{SELECTION_TAB.PROFILE}</h2>
                <div style={{overflow: "auto"}}>
                    <div className="Card" style={{ alignItems: "center", overflow: "auto" }}>
                        <div className="Field-container" style={{alignContent: "center"}}>
                            <label>User Id:</label>
                            <input
                                value={userId}
                                disabled />
                        </div>
                        <div className="Field-container">
                            <label>Name:</label>
                            <input
                                value={name}
                                disabled={!isEditMode}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setNameFocus(true)}
                                onBlur={() => setNameFocus(false)}
                            />
                        </div>
                        <p className={nameFocus && name && !isValidName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 32 characters.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p> 
                        <div className="Field-container">
                            <label>Email:</label>
                            <input
                                value={email}
                                disabled={!isEditMode}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            
                        </div>
                        <p className={emailFocus && email && !isValidEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Not a valid email address<br />
                        </p>  
                        <div className="Field-container">
                            <label>Phone No.:</label>
                            <input
                                value={phone}
                                disabled={!isEditMode}
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => setPhoneFocus(true)}
                                onBlur={() => setPhoneFocus(false)}
                            />
                        </div>
                        <p className={phoneFocus && phone && !isValidPhone ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Phone number should contain 10 digits<br />
                        </p>
                        <span>
                            {isEditMode ? <>
                                <button onClick={() => {isFormDirty() ?
                                        setShowConfirmModal(true) :
                                        setEditMode(false)}}
                                    disabled={!isValidName || !isValidEmail || !isValidPhone}
                                >
                                    Save Changes
                                </button>
                                <button onClick={() => {isFormDirty() ?
                                    setCancelModal(true) :
                                    setEditMode(false)}}
                                >
                                    Cancel
                                </button></>
                                : <button onClick={() => setEditMode(true)}>Edit Profile</button>}
                        </span>
                    </div>
                </div>
                
            </>
            }               
            {showCancelModal && <Modal
                icon={faXmark}
                message={"Are you sure you want to cancel?"}
                onConfirm={() => {cancelEditing();
                    setCancelModal(false)}}
                closeable={true}
                onCancel={() => setCancelModal(false)}/>
            }
            {showConfirmModal && <Modal
                icon={faFloppyDisk}
                message={"Are you sure you want to save changes?"}
                onConfirm={() => saveChanges()}
                closeable={true}
                onCancel={() => setShowConfirmModal(false)}/>
            }
            {showSaveSuccessModal && <Modal
                icon={faCheck}
                message={"Profile updated successfully!"}
                onConfirm={() => setSaveSuccessModal(false)}/>
            }
            {showSaveFailedModal && <Modal
                icon={faTimes}
                message={"Profile updation failed!"}
                onConfirm={() => setSaveFailedModal(false)}/>
            }
        </div>
        
    );
};
export default MyProfile;
