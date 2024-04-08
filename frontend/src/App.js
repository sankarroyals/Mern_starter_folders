import React, { Suspense, useEffect, useRef } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import AuthHoc, { LoginAuth } from "./AuthHoc";
import Toast from "./Components/Toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import {
  apicallloginDetails,
  setOnlineUsers,
} from "./redux/AuthReducers/AuthReducer";
import { io } from "socket.io-client";

import LoadingData from "./Components/Toast/Loading";
import { socket_io } from "./Utils";


const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(() =>
  import("./Components/ForgotPassword/ForgotPassword")
);
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() =>
  import("./Components/Home/Home")
);


const NoMatch = () => {
  return (
    <div className="noMatch">
      <div className="noRoute-image">
        <img src="/no-route.gif" alt="gif" />
      </div>
      <div className="noRoute-text">Oops..! no such routes found.</div>
    </div>
  );
};

const App = () => {



  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(apicallloginDetails());
  }, []);

  // intialize socket io
  const socket = useRef();
  const { email, user_id } = useSelector((store) => store.auth.loginDetails);

  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  // adding online users to socket io
  useEffect(() => {
    socket.current.emit("addUser", user_id);
    socket.current.on("getUsers", (users) => {
      dispatch(setOnlineUsers(users));
      console.log(users);
    });
  }, [email]);


  // live message updates
  useEffect(() => {
    socket.current.on("allDeviceLogout", () => {
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    });
  }, []);

  // DONT REMOVE THIS IT IS FOR DARK AND WHITE THEME
  //   useEffect(() => {
  //     if (!localStorage.getItem('theme')) {
  //       localStorage.setItem('theme', 'light')
  //       document.body.setAttribute('data-theme', 'light')
  //     } else {
  //       document.body.setAttribute('data-theme', localStorage.getItem('theme'))

  //    }
  //  }, [])


  // useEffect(() => {
  //   socket.current.on("getNotification", () => {
  //     dispatch(setNotification(true));

  //   });
  // }, []);






  return (
    <div>
      <Suspense
        fallback={
          <div className="Loading">
            <div class="loader">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        }
      >
        <Toast />
        <LoadingData />
        <Navbar />
        <Routes>
          <Route path="/signup" Component={LoginAuth(SignUp)} />
          <Route path="/login" Component={LoginAuth(Login)} />
          <Route path="/forgotpassword" Component={LoginAuth(ForgotPassword)} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/home" Component={AuthHoc(Home)} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
