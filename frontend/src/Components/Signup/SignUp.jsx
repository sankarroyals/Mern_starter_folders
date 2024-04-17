import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom/dist";
import GoogleAuth from "../GoogleAuth/GoogleAuth";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    email: null,
    emailOtp: null,
    name: null,
    role: null,
    password: null,
    isEmailOtpSent: null,
    emailVerified: null,
    isEmailValid: null,
    isNameValid: null,
    isPasswordValid: null,
  });
  const [loading, setLoading] = useState(false);
  const [sendEmailOtpLoading, setSendEmailOtpLoading] = useState(false);
  const [verifyEmailOtpLoading, setVerifyEmailOtpLoading] = useState(false);

  const {
    email,
    emailOtp,
    name,
    password,
    isEmailOtpSent,
    emailVerified,
    isEmailValid,
    isNameValid,
    isPasswordValid,
  } = inputs;

  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "name") {
      setInputs((prev) => ({ ...prev, isNameValid: e.target.value !== "" }));
    }
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(
          e.target.value
        ),
      }));
    }
    if (e.target.name === "password") {
      setInputs((prev) => ({
        ...prev,
        isPasswordValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(
            e.target.value
          ),
      }));
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendEmailOtp = async (e) => {
    e.preventDefault();
    setSendEmailOtpLoading(true);
    e.target.disabled = true;
    await ApiServices.sendOtp({
      to: email,
      type: "Sign Up",
      subject: "Email Verification",
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        // setIsEmailOtpSent(true);
        setSendEmailOtpLoading(false);
        setInputs((prev) => ({ ...prev, isEmailOtpSent: true }));
      })
      .catch((err) => {
        setSendEmailOtpLoading(false);
        dispatch(
          setToast({
            message: "OTP sent failed !",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = true;
      });

  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setVerifyEmailOtpLoading(true);
    await ApiServices.verifyOtp({
      email: email,
      otp: emailOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Email verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        document.getElementById("emailVerify").style.display = "none";
        document.getElementById("emailOtpInput").disabled = true;
        // setemailVerified(true);
        setVerifyEmailOtpLoading(false);
        setInputs((prev) => ({ ...prev, emailVerified: true }));
      })
      .catch((err) => {
        setVerifyEmailOtpLoading(false);
        dispatch(
          setToast({
            message: "Incorrect OTP",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);
    e.target.disabled = true;
    await ApiServices.register({
      email: email,
      password: password,
      userName: name,
      role: 'individual'
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "User Registered Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        navigate("/login");
        setLoading(false);
      })
      .catch((err) => {
        e.target.disabled = false;
        setLoading(false);
        dispatch(
          setToast({
            message: err.response.data.message,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  const isFormValid =
    isEmailValid &&
    emailVerified &&
    isNameValid &&
    isPasswordValid;

  return (
    <>
      <main className="signup-main-container">
        <div className="signup-hero">
          <div className="signup-form-section">
            <div class="signup-page">
              <div class="login-header">
                <p>Sign Up</p>
              </div>
              <div class="signup-container">
                <form action="">
                  <input
                    type="text"
                    className={
                      isNameValid !== null &&
                      (isNameValid ? "valid" : "invalid")
                    }
                    value={name}
                    name="name"
                    onChange={handleChanges}
                    placeholder="User Name*"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="email"
                      className={
                        isEmailValid !== null &&
                        (isEmailValid ? "valid" : "invalid")
                      }
                      value={email}
                      name="email"
                      onChange={handleChanges}
                      disabled={emailVerified}
                      placeholder="Email Address*"
                    />
                    {!isEmailOtpSent && isEmailValid && (
                      <div title='Send Otp'>
                        <i class="fas fa-paper-plane"
                          onClick={sendEmailOtp}
                          disabled={sendEmailOtpLoading}></i>
                      </div>

                    )}
                  </div>
                  {emailVerified === true && (
                    <img
                      src="checked.png"
                      height={20}
                      alt="Your Alt Text"
                      className="successIcons"
                    />
                  )}

                  {isEmailOtpSent && emailVerified !== true && (
                    <>
                      <input
                        type="text"
                        className={
                          emailOtp !== null &&
                          (emailOtp.length === 6 ? "valid" : "invalid")
                        }
                        value={emailOtp}
                        name="emailOtp"
                        onChange={handleChanges}
                        placeholder="Enter Email OTP"
                        id="emailOtpInput"
                      />
                      {emailOtp !== null && emailOtp.length === 6 && (
                        <button
                          type="button"
                          className="otp_button"
                          id="emailVerify"
                          onClick={verifyOtp}
                          disabled={verifyEmailOtpLoading}
                          style={{
                            whiteSpace: "nowrap",
                            position: "relative",
                            display: "flex",
                            gap: "3px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                          }}
                        >
                          {verifyEmailOtpLoading ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <div className="button-loader"></div>
                              <div>
                                <span style={{ marginLeft: "10px" }}>
                                  Verifying OTP...
                                </span>
                              </div>
                            </div>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      )}
                    </>
                  )}
                  <input onKeyDown={(e) => e.target.nextElementSibling.style.display = 'block'} onBlur={(e) => e.target.nextElementSibling.style.display = 'none'}
                    type="password"
                    className={
                      isPasswordValid !== null &&
                      (isPasswordValid ? "valid" : "invalid")
                    }
                    name="password"
                    value={password}
                    onChange={handleChanges}
                    placeholder="Create Password*"
                  />
                  <div className="passwordHint" style={{ display: 'none' }}>
                    <ul>
                      <li className={password?.length >= 8 ? 'success' : 'failure'}>Password should be atleast 8 character length</li>
                      <li className={/.*[A-Z].*/.test(password) ? 'success' : 'failure'}>Atleast one capital letter</li>
                      <li className={/.*[a-z].*/.test(password) && password ? 'success' : 'failure'}>Atleast one small letter</li>
                      <li className={/.*[!@#$%^&*()_+].*/.test(password) ? 'success' : 'failure'}>Atleast one special character (!@#$%^&*()_+)</li>
                      <li className={/.*[0-9].*/.test(password) ? 'success' : 'failure'}>Atleast one Number</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="full-width-button"
                    disabled={!isFormValid || loading}
                    onClick={signup}
                    style={{
                      whiteSpace: "nowrap",
                      position: "relative",
                      display: "flex",
                      gap: "3px",
                      justifyContent: "center",
                      alignItems: "center",
                      float: 'right',
                      width: '100%'
                      // borderRadius: "10px",
                    }}
                  >
                    {loading ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <div className="button-loader"></div>
                        <div>
                          <span style={{ marginLeft: "10px" }}>
                            Signing up...
                          </span>
                        </div>
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </form>
              </div>
              <div class="signup-header">
                <div>
                  <hr />
                  <p>or</p>
                  <hr />
                </div>
              </div>
              <p className="signup-option-text">
                Already have an account? <a href="/login">Log in</a>
              </p>
              <div style={{ marginTop: '20px' }} >
                <GoogleAuth />
              </div>
            </div>
          </div>
        </div>
        <div className="signup-left-container">
          <div className="signup-left-content"><h1>Become a Task Manager</h1>
            <p>Free to use, easy to track</p>
            <div className="checks"><div><span class="tick"><i class="fas fa-check"></i></span> Create a Project</div>
              <div><span class="tick"><i class="fas fa-check"></i></span> Add tasks to projects</div>
              <div><span class="tick"><i class="fas fa-check"></i></span> Assign tasks to team members</div>
              <div><span class="tick"><i class="fas fa-check"></i></span> Set project goals and milestones</div>
              <div><span class="tick"><i class="fas fa-check"></i></span> Track your progress</div>
              <div><span class="tick"><i class="fas fa-check"></i></span> Monitor task status and completion</div></div></div>
          <div className="signup-image-container">
            <img src="signup.png" alt="error" />
          </div>
        </div>
      </main>
    </>
  );
};
export default SignUp;
