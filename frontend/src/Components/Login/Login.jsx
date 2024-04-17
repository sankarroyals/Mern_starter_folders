import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import GoogleAuth from "../GoogleAuth/GoogleAuth";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: null,
    name: null,
    password: null,
    isEmailValid: null,
    isNameValid: null,
    isPasswordValid: null,
  });
  const [loading, setLoading] = useState(false);
  const {
    email,
    password,
    isEmailValid,
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
  const [loginType, setLoginType] = useState("email");

  const isFormValid =
    (loginType === "email" && isEmailValid && isPasswordValid)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    e.target.disabled = true;
    const obj = {
      email: email,
      password: password,
    };
    await ApiServices.login(obj)
      .then(async (res) => {
        setLoading(false);
        dispatch(
          setToast({
            message: "User Logged In Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        window.location.href = "/home";
      })
      .catch((err) => {
        setLoading(false);
        e.target.disabled = false;

        dispatch(
          setToast({
            message:
              err?.response?.data?.message !== ""
                ? err?.response?.data?.message
                : "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });

  };

  return (
    <>
      <main className="login-main-container">
        <div className="login-hero">
          <div className="login-form-section">
            <div class="login-page">
              <div class="login-header">
                <p>Login</p>
              </div>
              <div class="login-container">
                
                <form action="">
                    <>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        className={
                          isEmailValid !== null &&
                          (isEmailValid ? "valid" : "invalid")
                        }
                        placeholder="Email Address"
                        onChange={handleChanges}
                      />
                      <input
                        type="password"
                        className={
                          isPasswordValid !== null &&
                          (isPasswordValid ? "valid" : "invalid")
                        }
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={handleChanges}
                      />
                    </>
                  
                 
                  <button
                    className=""
                    type="submit"
                    disabled={!isFormValid || loading}
                    onClick={login}
                    style={{
                      whiteSpace: "nowrap",
                      position: "relative",
                      display: "flex",
                      gap: "3px",
                      justifyContent: "center",
                      alignItems: "center",
                      width: '10px', background: 'var(--primary)'
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
                            Logging in...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        
                        Login
                      </>
                    )}
                  </button>
                </form>
              </div>
              <div className="login-header">
                <div>
                  <hr />
                  <p>or</p>
                  <hr />
                </div>
              </div>
              <p className="login-option-text">
                New here? <a href="/signup">Sign up</a>
              </p>
              <p className="login-option-text" style={{ zIndex: 999 }}>
                <a href="/forgotpassword">Forgot Password?</a>
              </p>
              <GoogleAuth />
            </div>
          </div>
        </div>
        <div className="signup-left-container">
          <div className="signup-left-content"><h1>Become a Task Creater</h1>
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

export default Login;
