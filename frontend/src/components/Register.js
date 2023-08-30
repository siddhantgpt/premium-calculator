import React, { useEffect, useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX, PWD_REGEX } from "../helper/RegexHelper";
import { request } from "../helper/AxiosHelper";
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from "../helper/AuthHelper";

const Register = () => {

    const nameRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [validName, setValidName] = useState  (false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/app/my-policies')
        }
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone));
    }, [phone])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [name, email, phone, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1 = NAME_REGEX.test(name);
        const v2 = EMAIL_REGEX.test(email);
        const v3 = PHONE_REGEX.test(phone);
        const v4 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }

        await request(
            "POST",
            "/api/register",
            {
                name: name,
                email: email,
                phone: phone,
                password: pwd
            }).then(
            (response) => {
                navigate("/auth/login")
            }).catch(
            (error) => {
                console.log("ERROR", error?.response?.data?.error)
                error?.response?.data?.error ? setErrMsg(error?.response?.data?.error) : setErrMsg("Error!")
            }
        );
    }

    return ( 
            <div><h2>Register</h2><form className={"Panel"} style={{width: "25%"}} onSubmit={handleSubmit}>
            <div className="auth-panel">
                <label htmlFor="name">
                    <span>
                        {"Name:"}
                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                    </span>
                </label>
                <input
                    type="text"
                    id="name"
                    ref={nameRef}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setNameFocus(true)}
                    onBlur={() => setNameFocus(false)} />
                <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    3 to 32 characters.<br />
                    Letters, numbers, underscores, hyphens allowed.
                </p>
            </div>

            <div className="auth-panel">
                <label htmlFor="email">
                    <span>
                        {"Email:"}
                        <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                    </span>
                </label>
                <input
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
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
                <label htmlFor="phone">
                    <span>
                        {"Phone No.:"}
                        <FontAwesomeIcon icon={faCheck} className={validPhone ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPhone || !phone ? "hide" : "invalid"} />
                    </span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                    aria-invalid={validPhone ? "false" : "true"}
                    aria-describedby="phonenote"
                    onFocus={() => setPhoneFocus(true)}
                    onBlur={() => setPhoneFocus(false)} />
                <p id="phonenote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Not a valid email address<br />
                </p>
            </div>

            <div className="auth-panel">
                <label htmlFor="password">
                    {"Password:"}
                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
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
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>
            </div>

            <div className="auth-panel">
                <label htmlFor="confirm_pwd">
                    <span>
                        {"Confirm Password:"}
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </span>
                </label>
                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)} />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>
            </div>

            <button disabled={!validName || !validPwd || !validMatch || !validEmail ? true : false}>Register</button>

            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

        </form></div>
        
    )

};
export default Register;