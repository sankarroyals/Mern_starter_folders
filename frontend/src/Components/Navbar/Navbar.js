import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import { setLoginData, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { Howl } from "howler";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import ThreePOutlinedIcon from "@mui/icons-material/ThreePOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { io } from "socket.io-client";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  getAllNotifications,
  setMessageCount,
  setNotification,
} from "../../redux/Conversationreducer/ConversationReducer";
import { Drawer, Tab, Tabs, Typography } from "@mui/material";
import MessageRequest from "../Conversation/Notification/MessageRequest";
import { format } from "timeago.js";
import useWindowDimensions from "../Common/WindowSize";
import { socket_io } from "../../Utils";
import ProfileImageUpdate from "./ProfileImageUpdate";



const Navbar = () => {
  const { email, role, userName, image, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );

  const [logoutOpen, setLogoutOpen] = useState(false)
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [isMobile, setIsMobile] = useState(window.outerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const [drawerState, setDrawerState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState({ ...drawerState, [anchor]: open });
  };


  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {width < 770 && (
          <>
            
          </>
        )}

        {width < 770 && (
          <>
            <ListItem
              button
              key="searchUsers"
              onClick={() => navigate("/searchusers")}
            >
              <ListItemIcon>
                <SearchOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Search Users" />
            </ListItem>

            <ListItem
              button
              key="livePitches"
              onClick={() => navigate("/livePitches")}
            >
              <ListItemIcon>
                <BallotOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Live Pitches" />
            </ListItem>


          </>
        )}

        {role === "Admin" && (
          <>
            <ListItem
              button
              key="profileRequests"
              onClick={() => navigate("/profileRequests")}
            >
              <ListItemIcon>
                <PersonSearchOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Profile Requests" />
            </ListItem>

            <ListItem button key="pitches" onClick={() => navigate("/pitches")}>
              <ListItemIcon>
                <PlagiarismOutlinedIcon className="menu-icon" />
              </ListItemIcon>
              <ListItemText primary="Pitch Request" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);


  const handleClickOpen = () => {
    document
      .getElementsByClassName("userDetails")[0]
      .classList.remove("showUserDetails");
    setOpen(true);
  };


  const navigate = useNavigate();
  const dispatch = useDispatch();




  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "editProfile" &&
      event.target.id !== "Profile-img"
    ) {
      document
        .getElementsByClassName("userDetails")[0]
        .classList.remove("showUserDetails");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // console.log(window.location.pathname.slice(1));

    if (document.getElementsByClassName("navSelected")?.length > 0) {
      document
        .getElementsByClassName("navSelected")[0]
        ?.classList.remove("navSelected");
    }
    if (document.getElementsByClassName("highletNavImg")?.length > 0) {
      document
        .getElementsByClassName("highletNavImg")[0]
        ?.classList.remove("highletNavImg");
    }

    if (window.location.pathname.slice(1) !== "editProfile") {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.classList.add("navSelected");
      if (window.location.pathname.slice(1).split("/")[0] === "conversations") {
        document
          .getElementById("conversations")

          ?.classList.add("navSelected");
      }

      if (window.location.pathname.slice(1).split("/")[0] === "user") {
        document
          .getElementById("searchusers")

          ?.classList.add("navSelected");
      }

      if (window.location.pathname.slice(1).split("/")[0] === "livePitches") {
        document
          .getElementById("livePitches")

          ?.classList.add("navSelected");
      }
    } else {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.children[0].classList.add("highletNavImg");
    }
  }, [window.location.pathname]);

  const { width } = useWindowDimensions();



  const logoutDecider = (value) => {

    if (value == 'All') {
      socket.current.emit("logoutAll", {
        userId: user_id,

      });
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    } else if (value == 'Single') {
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return (
    <div
      className="navbar"
      style={{
        display: localStorage.getItem("user") == undefined ? "none" : "flex",
      }}
    >
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <img
          id="logoImage"
          src={
            localStorage.getItem("theme") == "light"
              ? "/logo.png"
              : "/logo.png"
          }
          alt="logo"
        />
      </div>

      <div className="menuIcons">
        {width > 770 && (
          <>



            {role === "Admin" && (
              <>

              </>
            )}
          </>
        )}

        {width < 770 && (
          <></>
        )}

        {/* DARK AND WHITE THEME */}
        {/* <div
          id=""
          className="icon"
          title={`Switch to ${
            localStorage.getItem("theme") === "light" ? "Dark" : "Light"
          } Mode`}
          onClick={(e) => {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const mode = newTheme === "light" ? "Dark" : "Light";

            body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            document.getElementById("themeIcon").className = `fas fa-${
              newTheme == "light" ? "moon" : "sun"
            }`;

            // Switching the logo based on the theme
            const logoImg = document.getElementById("logoImage");
            logoImg.src =
              newTheme === "light" ? "/Footer-Logo.png" : "/Footer-Logo.png";
            logoImg.alt = `${mode} Logo`;

            e.currentTarget.title = `Switch to ${mode} Mode`;
          }}
        >
          <i
            id="themeIcon"
            class={`fas fa-${
              localStorage.getItem("theme") == "light" ? "moon" : "sun"
            }`}
          ></i>
        </div> */}

        <div
          id="editProfile"
          style={{ position: "relative" }}
          onClick={() => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.toggle("showUserDetails");
          }}
        >
          <img

            id="Profile-img"
            className="Profile-img"
            src={image !== undefined && image !== "" ? image : "/profile.png"}
            alt=""
          />
          {verification === "approved" && (
            <></>
          )}
        </div>
        {width < 770 && (
          <>
            <div className="icon" onClick={toggleDrawer("right", true)}>
              <MenuRoundedIcon />
            </div>
            <Drawer
              anchor="right"
              open={drawerState["right"]}
              onClose={toggleDrawer("right", false)}
              onOpen={toggleDrawer("right", true)}
              disableBackdropTransition={!isMobile}
              disableDiscovery={!isMobile}
            >
              {list("right")}
            </Drawer>
          </>
        )}
        <div className="userDetails" ref={userDetailsRef}>
          <span className="line-loader"></span>
          <div
            className="closeIcon"
            onClick={() => {
              document
                .getElementsByClassName("userDetails")[0]
                .classList.remove("showUserDetails");
            }}
          >
            <i className="fas fa-times cross"></i>
          </div>
          <div>
            <div className="email">{email}</div>
            <div className="popupImg">
              <img
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  maxWidth: "100%",
                  display: 'block'
                }}
                src={
                  image !== undefined && image !== "" ? image : "/profile.png"
                }
                alt="Profile"
              />
              <i
                className="fas fa-pencil-alt edit-icon"
                onClick={handleClickOpen}
              ></i>
            </div>
          </div>

          <div className="username">Hi, {userName}!</div>
          <div className="manage" title="view profile" onClick={() => navigate(`/user/${user_id}`)}>{role}</div>

          <div className="editPopupActions">
            <div
              className="logout"
              onClick={() => {
                setLogoutOpen(true)

              }}
            >
              <i
                className="fas fa-sign-out-alt"
                style={{ marginRight: "5px" }}
              ></i>{" "}
              Logout
            </div>
          </div>
        </div>

        <Dialog
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{}}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ display: "flex", justifyContent: "center" }}
          >

          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div style={{ fontSize: '20px' }}>
                How Do you want to logout ?
              </div>



              <div
                style={{ display: "flex", gap: "2px", borderRadius: "10px", justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}
              >
                <button
                  onClick={() => logoutDecider('All')}
                  style={{ whiteSpace: "nowrap", position: "relative" }}
                >


                  Logout from all devices

                </button>
                <button
                  onClick={() => logoutDecider('Single')}
                  style={{ whiteSpace: "nowrap", position: "relative" }}
                >


                  Logout from this device

                </button>


              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>


        <ProfileImageUpdate open={open} setOpen={setOpen} />

      </div>
    </div>
  );
};

export default Navbar;
