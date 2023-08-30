import React, { useEffect, useRef, useState } from "react";
import { faCheck, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { request } from "../helper/AxiosHelper";
import { EMAIL_REGEX, PWD_REGEX } from "../helper/RegexHelper";
import Modal from "./Modal";
import { isLoggedIn, setLoginDetails } from "../helper/AuthHelper";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Login = () => {

    const emailRef = useRef();
    const errRef = useRef();

    const [isLoading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(true);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(true);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailedModal, setShowFailedModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/app/my-policies')
        }
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            setShowFailedModal(true);
            setValidEmail(v1);
            setValidPwd(v2);
            return;
        }

        await request(
            "POST",
            "/api/login",
            {
                email: email,
                password: pwd
            }).then(
            (response) => {
                const user = response?.data?.user;
                setLoginDetails(user?.user_id, user?.name, user?.token)
                navigate('/app/my-policies');
            }).catch(
            (error) => {
                error?.response?.data?.error ? setErrMsg(error?.response?.data?.error) : setErrMsg("Error!")
            }
        );
        setLoading(false);
    }

    return ( 
        <div>
            {isLoading ? <Loader/> :
            <><h2>Sign In</h2><form className={"Panel"} style={{ width: "25%" }} onSubmit={handleSubmit}>
                    <div className="auth-panel">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            ref={emailRef}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)} />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Not a valid email address<br />
                        </p>
                    </div>

                    <div className="auth-panel">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)} />
                        <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                    </div>

                    <button>Sign In</button>

                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                </form></>
            }
            {showSuccessModal && <Modal 
                icon={faCheck} 
                message={"Sign In Successful"}
                onConfirm={() => {
                    setShowSuccessModal(false);
                    // setLoggedIn(window.localStorage.getItem("llr_login") !== null)
                }}
            />}
            {showFailedModal && <Modal
                icon={faXmark} 
                message={errMsg}
                onConfirm={() => {setShowFailedModal(false)}}
            />}
        </div>
    )

};
export default Login;