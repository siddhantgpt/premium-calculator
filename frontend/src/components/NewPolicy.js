import React, { useEffect, useRef, useState } from 'react';
import { SELECTION_TAB, SUM_ASSURED_OPTIONS } from '../constants';
import Slider from '@mui/material/Slider';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { getUserId, isLoggedIn } from '../helper/AuthHelper';
import { INTEGER_REGEX } from '../helper/RegexHelper';
import Modal from './Modal';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatCurrencyINR } from '../helper/StringHelper';
import Loader from './Loader';
import { request } from '../helper/AxiosHelper';

const useStyles = makeStyles({
    sliderRoot: {
        '& .MuiSlider-rail': {
            color: 'black'
          },
        '& .MuiSlider-track': {
            color: 'black ',
            transition: 'width 0.2s'
        },
        '& .MuiSlider-thumb': {
            width: '1rem', // Change this to your desired width
            height: '1rem', // Change this to your desired height
            color: 'black'
        },
    },
});


const NewPolicy = () => {

    const classes = useStyles();

    const [sumAssured, setSumAssured] = useState(500000);
    const [tier, setTier] = useState("tier-1")
    const [tenure, setTenure] = useState(1);
    const [memberData, setMemberData] = useState([]);
    const [showConfirmCancelModal, setConfirmCancelModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [showSaveErrorModal, setSaveErrorModal] = useState(false);

    const errRef = useRef();

    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    
    useEffect(() => {
        if (!isLoggedIn()) navigate('/auth/login');
    }, []);

    useEffect(() => {
        setErrMsg("")
    }, [tenure, memberData]);

    const handleSliderChange = (event, newValue) => {
        setSumAssured(SUM_ASSURED_OPTIONS[newValue].value);
    };

    const handleValueText = (value) => {
        return SUM_ASSURED_OPTIONS[value].label;
    };

    const getAge = (dob) => {
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        return age >= 0 ? (age + " Years") : "";
    };

    const validPolicyData = () => {
        let adult = 0;
        let child = 0;
        let isValid = true;
        let policyType = "";

        if (tenure > 80) {
            setErrMsg("Tenure must be less than 80 years");
            errRef.current.focus();
            return false;
        }

        if (memberData.length === 0) {
            setErrMsg("Atleast 1 member must be added for insurance");
            errRef.current.focus();
            return false;
        }
        
        memberData.forEach((member) => {
            if(!member.name || !member.dob) {
                setErrMsg("Name and DOB of all members are required");
                errRef.current.focus();
                isValid = false;
            }

            const age = new Date().getFullYear() - new Date(member.dob).getFullYear();
            if (age<18 || age>99) {
                setErrMsg("All members age must be between 18-99 years")
                errRef.current.focus();
                isValid = false
            } else adult +=1;
        })

        if(adult >2){
            setErrMsg("Maximum of 2 adults and 4 chilren can be covered under one policy")
            errRef.current.focus();
            return false;
        }

        if (isValid) {
            policyType = adult + "a" + (child ? "," + child + "c" : "");
        }

        return { isValid, policyType };
    };

    const handleCancel = () => {
        setSumAssured(500000);
        setTenure(1);
        setMemberData([]);
        setConfirmCancelModal(false);
    };

    const saveChanges = async () => {
        setLoading(true);

        const { isValid, policyType } = validPolicyData()

        if(isValid){
            await request(
                "POST",
                "/api/save-policy",
                {
                    user_id: getUserId(),
                    policy_type: policyType,
                    tier: tier,
                    sum_assured: sumAssured,
                    tenure: tenure,
                    member_data: memberData
                }
            ).then((response) => { 
                console.log(response.data.policy_id)
                navigate('/app/policy-summary', { state: { policyId: response.data.policy_id } });
            }).catch((error) => {setSaveErrorModal(true)})
        }

        setLoading(false);

    };

    const addMemberForm = (data, index) => {

        const nameChangeHandler = (value) => {
            const updatedMemberData = [...memberData];
            updatedMemberData[index].name = value;
            setMemberData([...updatedMemberData]);
        };

        const dateChangeHandler = (value) => {
            const updatedMemberData = [...memberData];
            updatedMemberData[index].dob = value;
            setMemberData([...updatedMemberData]);
        };

        const deleteMember = () => {
            setMemberData(memberData.filter((data, i) => i !== index));
        }

        return(
            <div className='Member-card'>
                <div className='Field-container'>
                    <label>
                        Name:
                    </label>
                    <input
                        value={data?.name}
                        type='text'
                        onChange={(e) => {nameChangeHandler(e.target.value)}}
                    />
                </div>
                <div className='Field-container'>
                    <label>
                        DOB:
                    </label>
                    <input
                        type='date'
                        value={data?.dob}
                        max={today}
                        onChange={(e) => {dateChangeHandler(e.target.value)}}
                    />
                </div>
                <div className='Field-container'>
                    <label>
                        Age:
                    </label>
                    <input
                        type='text'
                        disabled
                        value={getAge(data.dob)}
                    />
                </div>
                <button onClick={deleteMember}>Remove</button>
            </div>
        );
    };

  return(
    <div className='Selected-content'>
        {isLoading ? <Loader/> :
            <><h2>{SELECTION_TAB.CREATE_POLICY}</h2><div style={{ overflow: "auto" }}>
                    <div className='Card'>
                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                            <div className='Field-container' style={{ width: "60%" }}>
                                <label>Sum Assured:</label>
                                <input
                                    style={{ textAlign: "right" }}
                                    value={formatCurrencyINR(sumAssured)}
                                    disabled
                                    type='text' />
                            </div>
                            <div style={{ width: "50%", margin: "0.5rem" }}>
                                <p>Slide to choose Sum Assured</p>
                                <Slider
                                    className={classes.sliderRoot}
                                    onChange={handleSliderChange}
                                    valueLabelFormat={handleValueText}
                                    step={1}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={10}
                                    width={"20%"} />
                            </div>


                        </div>

                        <div className='Field-container'>
                            <label>City Tier:</label>
                            <select onChange={(e) => setTier(e.target.value)}>
                                <option value={'tier-1'}>Tier-1</option>
                            </select>
                        </div>
                        <div className='Field-container'>
                            <label>Policy Tenure (years):</label>
                            <input
                                style={{ textAlign: "right" }}
                                value={tenure}
                                type='number'
                                onChange={(e) => (INTEGER_REGEX.test(e.target.value)) && setTenure(e.target.value)}
                                max={81} />
                        </div>
                    </div>
                    {memberData.map((data, index) => (
                        addMemberForm(data, index))
                    )}
                    <div>
                        <button onClick={() => { setMemberData([...memberData, { name: '', dob: '' }]); } }
                            disabled={memberData.length >= 6}>Add Members</button>
                    </div>
                    <p ref={errRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        style={{width: "80%", alignContent: "center"}}>
                            {errMsg}
                        </p>
                    <div>
                        <button onClick={() => saveChanges()}>
                            Save and Proceed
                        </button>
                        <button onClick={() => setConfirmCancelModal(true)}>
                            Cancel
                        </button>
                    </div>
                </div></> 
        }   
        {showConfirmCancelModal && <Modal
                icon={faTimes}
                message={"Are you sure you want to cancel?"}
                onConfirm={() => handleCancel()}
                closeable={true}
                onCancel={() => setConfirmCancelModal(false)}/>
        }
        {showSaveErrorModal && <Modal
                icon={faTimes}
                message={"Unable to save your policy!"}
                onConfirm={() => setSaveErrorModal(false)}
                closeable={false}/>
        }
    </div>
  );
};
export default NewPolicy;
