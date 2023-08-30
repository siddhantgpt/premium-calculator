import React, { useEffect, useState } from "react";
import { SELECTION_TAB } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFloppyDisk, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { PWD_REGEX } from "../helper/RegexHelper";
import Modal from "./Modal";
import { request } from "../helper/AxiosHelper";
import { isLoggedIn } from "../helper/AuthHelper";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [isValidPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchPwd, setMatchPwd] = useState("");
    const [isValidMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const [showSaveConfirmModal, setSaveConfirmModal] = useState(false);
    const [showSaveSuccessModal, setSaveSuccessModal] = useState(false);
    const [showSaveFailedModal, setSaveFailedModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) navigate('/auth/login');
    }, []);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(newPwd));
        setValidMatch(newPwd === matchPwd);
    }, [newPwd, matchPwd])

    const updatePassword = async () => {
        setSaveConfirmModal(false);

        if (currentPwd && isValidPwd && isValidMatch) {
            await request(
                "POST",
                "/api/update-password",
                {
                    user_id: "64d68390c91995a5e7bd84ce",
                    current_password: currentPwd,
                    new_password: newPwd,
                }
            ).then((response) => { 
                setSaveSuccessModal(true);
                setCurrentPwd("");
                setNewPwd("");
                setMatchPwd("");
            }).catch((error) => {setSaveFailedModal(true)});
        }

    }

    return(
        <div className="Selected-content">
            <h2>{SELECTION_TAB.CHANGE_PASSWORD}</h2>
            <div style={{overflow: "auto"}}>
                <div className="Card" style={{ alignItems: "center", overflow: "auto" }}>
                    <div className="Field-container" style={{alignContent: "center"}}>
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={currentPwd}
                            onChange={(e) => setCurrentPwd(e.target.value)}
                        />
                    </div>
                    <div className="Field-container" style={{alignContent: "center"}}>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                    </div>
                    <p className={newPwd && pwdFocus && !isValidPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span>!</span> <span>@</span> <span>#</span>
                        <span>$</span> <span>%</span>
                    </p>
                    <p className={newPwd &&  pwdFocus && currentPwd === newPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        New password must not match current password
                    </p>
                    <div className="Field-container" style={{alignContent: "center"}}>
                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            value={matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                    </div>
                    <p className={matchFocus && !isValidMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>
                    <button
                        disabled={currentPwd === newPwd || !currentPwd || !isValidPwd || !isValidMatch}
                        onClick={() => setSaveConfirmModal(true)}
                    >
                        Update Password
                    </button>
                </div>

            </div>
            {showSaveConfirmModal && <Modal
                icon={faFloppyDisk}
                message={"Are you sure you want to update password?"}
                onConfirm={() => updatePassword()}
                closeable={true}
                onCancel={() => setSaveConfirmModal(false)}/>
            }
            {showSaveSuccessModal && <Modal
                icon={faCheck}
                message={"Password updated successfully!"}
                onConfirm={() => setSaveSuccessModal(false)}/>
            }
            {showSaveFailedModal && <Modal
                icon={faTimes}
                message={"Failed!"}
                onConfirm={() => setSaveFailedModal(false)}/>
            }
        </div>
    );
};
export default ChangePassword;
