import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from "./Loader";
import { SELECTION_TAB } from "../constants";
import { request } from "../helper/AxiosHelper";
import { formatCurrencyINR, percentageFormatter } from "../helper/StringHelper";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

const PolicySummary = () => {

  const [isLoading, setLoading] = useState(false);
  const [policyData, setPolicyData] = useState({});
  const [showConfirmCheckoutModal, setConfirmCheckoutModal] = useState(false);
  const [showCancelCheckoutModal, setCancelCheckoutModal] = useState(false);
  const [showCheckoutSuccessModal, setCheckoutSuccessModal] = useState(false);
  const [showCheckoutFailedModal, setCheckoutFailedModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const policyId = location.state ? location.state.policyId : null;

  useEffect(() => {
    getPolicy();
  }, []);

  const getPolicy = async () => {
    setLoading(true);

    await request(
      "GET",
      "api/get-policy",
      null,
      {
          policy_id: policyId
      }).then(
      (response) => {
        setPolicyData(response?.data);
      }).catch(
      (error) => {
        console.log("FAILED")         
      }
    );
    setLoading(false);
  };

  const checkoutPolicy = async () => {
    setConfirmCheckoutModal(false);
    setLoading(true);

    await request(
      "POST",
      "api/checkout-policy",
      null,
      {
          policy_id: policyId
      }).then(
      (response) => {
        setCheckoutSuccessModal(true);
      }).catch(
      (error) => {
        setCheckoutFailedModal(true);
          
      }
    );
    setLoading(false);
  };

  return (
    <div className="Selected-content">
      {isLoading ? <Loader/> :
        <>
          <h2>{SELECTION_TAB.POLICY_SUMMARY}</h2>
          <div style={{ overflow: "scroll" }}>
            <div className="Card" style={{alignItems: "center"}}>
              <div className="Field-container" style={{alignContent: "center"}}>
                <div style={{width: "50%"}}>Policy Id:</div>
                <div style={{width: "50%"}}>{policyData?._id}</div>
              </div>
              <div className="Field-container" style={{alignContent: "center"}}>
                <div style={{width: "50%"}}>Policy Type:</div>
                <div style={{width: "50%"}}>{policyData?.policy_type}</div>
              </div>
              <div className="Field-container" style={{alignContent: "center"}}>
                <div style={{width: "50%"}}>Sum Assured:</div>
                <div style={{width: "50%"}}>{formatCurrencyINR(policyData?.sum_assured)}</div>
              </div>
              <div className="Field-container" style={{alignContent: "center"}}>
                <div style={{width: "50%"}}>Policy Tenure:</div>
                <div style={{width: "50%"}}>{policyData?.tenure + " Years"}</div>
              </div>
              <div className="Field-container" style={{alignContent: "center"}}>
                <div style={{width: "50%"}}>Premium:</div>
                <div style={{width: "50%"}}>{formatCurrencyINR(policyData?.total_premium) + " p.a."}</div>
              </div>
              <div className="Field-container" style={{alignContent: "center"}}>
                <div style={{width: "50%"}}>City Tier:</div>
                <div style={{width: "50%"}}>{policyData?.tier}</div>
              </div>
              <h4>Policy Member Details:</h4>
              <table>
                <tr  id="heading">
                  <td>Name</td>
                  <td>DOB</td>
                  <td>Premium Rate</td>
                  <td>Floater Discount</td>
                  <td>Discounted Price</td>
                </tr>
                {policyData.member_data?.map((member) => {
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
              </table>
              <span>
                <button onClick={() => setConfirmCheckoutModal(true)}>
                  Checkout
                </button>
                <button onClick={() => setCancelCheckoutModal(true)}>
                  Cancel
                </button>
              </span>
            </div>
          </div>
        </>
      }
      {showConfirmCheckoutModal && <Modal
        icon={faCheck}
        message={"Are you sure you want to checkout this policy?"}
        onConfirm={() => checkoutPolicy()}
        closeable={true}
        onCancel={() => setConfirmCheckoutModal(false)}/>
      }
      {showCancelCheckoutModal && <Modal
        icon={faTimes}
        message={"Are you sure you want to cancel?"}
        onConfirm={() => navigate('/app/my-policies')}
        closeable={true}
        onCancel={() => setCancelCheckoutModal(false)}/>
      }
      {showCheckoutSuccessModal && <Modal
        icon={faCheck}
        message={"Congratulations! You are insured now."}
        onConfirm={() => navigate('/app/my-policies')}
        closeable={false}/>
      }
      { showCheckoutFailedModal && <Modal
        icon={faTimes}
        message={"Unable to checkout your policy!"}
        onConfirm={() => setCheckoutFailedModal(false)}
        closeable={false}/>
      }
    </div>
  );
};

export default PolicySummary;
