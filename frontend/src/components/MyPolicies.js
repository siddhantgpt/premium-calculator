import React, { useEffect, useState } from "react";
import { request } from "../helper/AxiosHelper";
import { SELECTION_TAB } from "../constants";
import { dateFormatter, formatCurrencyINR, percentageFormatter } from "../helper/StringHelper";
import { getUserId, isLoggedIn } from "../helper/AuthHelper";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

const MyPolicies = () => {

    const [isLoader, setLoader] = useState(true);
    const [checkedOutPolicies, setCheckedOutPolicies] = useState([]);
    const [savedPolicies, setSavedPolicies] = useState([]);
    const [expandedPolicy, setExpandedPolicy] = useState("");
    const [showSavedPolicy, setShowSavedPolicy] = useState(true);
    const [policyToDelete, setPolicyToDelete] = useState("");
    const [showConfirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [showDeleteSuccessModal, setDeleteSuccessModal] = useState(false);
    const [showDeleteFailedModal, setDeleteFailedModal] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) navigate('/auth/login');
        else getData();
    }, []);

    const getData = async () => {
        setLoader(true)
        await request(
            "GET",
            "api/get-policy-data",
            null,
            {
                user_id: getUserId()
            }).then(
            (response) => {
                const data = response?.data;
                setCheckedOutPolicies(data.filter((policy) => policy.is_checked_out === true));
                setSavedPolicies(data.filter((policy) => policy.is_checked_out === false));
            }).catch(
            (error) => {
                console.log("FAILED")
                
            }
        );
        setLoader(false);
    };

    const deletePolicy = async () => {
        setConfirmDeleteModal(false);
        setLoader(true);
        await request(
            "DELETE",
            "api/delete-policy",
            null,
            {
                policy_id: policyToDelete
            }).then(
            (response) => {
                setDeleteSuccessModal(true);
                getData();
            }).catch(
            (error) => {
                setDeleteFailedModal(true);
            }
        );
        setLoader(false);
    };

    const showPolicy = (policy) => {

        const policy_id = policy._id.$oid;

        const expandButtonHandler = () => {
            if (policy_id === expandedPolicy) setExpandedPolicy("");
            else setExpandedPolicy(policy_id);
        }

        return (
            <div className="Card">
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <div className="Field-container" style={{width: "35%"}}>
                        <div>Policy Id:</div>
                        <div>{policy_id}</div>
                    </div>
                    <button onClick={expandButtonHandler}>
                        {policy_id === expandedPolicy ? "Hide Members" : "Show Members"}
                    </button>
                </div>
                <hr/>
                <div style={{display: "grid", gridTemplate: "50% 50% / 1fr 1fr 1fr", width: "100%"}}>
                    <div className="Field-container" style={{width: "auto"}}>
                        <div>Sum Assured:</div>
                        <div>{formatCurrencyINR(policy.sum_assured)}</div>
                    </div>
                    <div className="Field-container" style={{width: "auto"}}>
                        <div>Policy Tenure:</div>
                        <div>{policy.tenure + " Years"}</div>
                    </div>
                    <div className="Field-container" style={{width: "auto"}}>
                        <div>Premium:</div>
                        <div>{formatCurrencyINR(policy.total_premium) + " p.a"}</div>
                    </div>
                    <div className="Field-container" style={{width: "auto"}}>
                        <div>Policy Type:</div>
                        <div>{policy.policy_type}</div>
                    </div>
                    <div className="Field-container" style={{width: "auto"}}>
                        <div>Policy Date:</div>
                        <div>{dateFormatter(policy.checkout_timestamp?.$date || "")}</div>
                    </div>
                    <div className="Field-container" style={{width: "auto"}}>
                        <div>City Tier:</div>
                        <div>{policy.tier}</div>
                    </div>
                </div>
                { policy_id === expandedPolicy &&
                    <>
                        <h3>Policy Member Details:</h3><table>
                        <tr  id="heading">
                            <td>Name</td>
                            <td>DOB</td>
                            <td>Premium Rate</td>
                            <td>Floater Discount</td>
                            <td>Discounted Price</td>
                        </tr>
                        {policy.member_data?.map((member) => {
                            return (
                                <tr>
                                    <td>{member.name}</td>
                                    <td>{member.dob}</td>
                                    <td>{formatCurrencyINR(member.premium_rate)}</td>
                                    <td>{percentageFormatter(member.floater_discount)}</td>
                                    <td>{formatCurrencyINR(member.discounted_rate)}</td>
                                </tr>
                            );
                        })}
                    </table></>
                }
                {!policy?.is_checked_out && <span style={{alignSelf: "center"}}>
                    <button onClick={() => navigate('/app/policy-summary', { state: { policyId: policy_id } })}>
                        Checkout
                    </button>
                    <button onClick={() => { setPolicyToDelete(policy_id);
                        setConfirmDeleteModal(true)}}>
                        Delete
                    </button>
                </span>
                }   
            </div>
        );
    };

    return(
        <div className="Selected-content">
            {isLoader ? <Loader/> :
            <><h2>{SELECTION_TAB.POLICIES}</h2><div style={{ overflow: "auto" }}>
                    {checkedOutPolicies.map((policy) => showPolicy(policy))}
                    {savedPolicies.length > 0 &&
                        <div className="Expander" onClick={() => { setShowSavedPolicy(!showSavedPolicy); } }>
                            Saved Policies
                        </div>}
                    {showSavedPolicy && savedPolicies.map((policy) => showPolicy(policy))}

                </div></>
            }           
            {showConfirmDeleteModal && <Modal
                icon={faTrash}
                message={"Are you sure you want to delete this policy?"}
                onConfirm={() => deletePolicy()}
                closeable={true}
                onCancel={() => setConfirmDeleteModal(false)}/>
            }
            {showDeleteSuccessModal && <Modal
                icon={faCheck}
                message={"Policy successfully deleted!"}
                onConfirm={() => setDeleteSuccessModal(false)}/>
            }
            {showDeleteFailedModal && <Modal
                icon={faTimes}
                message={"Unable to delete policy!"}
                onConfirm={() => setDeleteFailedModal(false)}/>
            }
        </div>
    );
};
export default MyPolicies;
