import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import { socket_io } from "../../Utils";
import ProfileImageUpdate from "./ProfileImageUpdate";
import NameGenerator from "../Common/NameGenerator";



const Navbar = () => {
  const { email, role, userName, image, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);


  const handleClickOpen = () => {
    document
      .getElementsByClassName("userDetails")[0]
      .classList.remove("showUserDetails");
    setOpen(true);
  };


  const navigate = useNavigate();




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


  const [helpPopOpen, setHelpPopOpen]= useState(false)


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
          navigate("/home");
        }}
      >
        <img
          id="logoImage" style={{height: '50px',width: '200px', marginBottom: '-15px',  objectFit: 'cover'  }}
          src="/logo.png"
          // src={
            
          //   localStorage.getItem("theme") == "light"
          //     ? process.env.REACT_APP_MAIL_LOGO
          //     : process.env.REACT_APP_MAIL_LOGO
          // }
          alt="logo"
        />
      </div>

      <div className="menuIcons">
          <>
            {role === "Admin" && (
              <>
              <div title="Profiles">
                <i className="far fa-user icon" id="profiles"
                  onClick={() => navigate("/profiles")}></i>
               
              </div>
              </>
            )}
        </>
        <div title="Help">
          <HelpOutlineOutlinedIcon className='icon' style={{transform: 'translateY(3px)'}} onClick={()=>setHelpPopOpen(true)} />

        </div>

        {/* DARK AND WHITE THEME */}
        <div
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
            // const logoImg = document.getElementById("logoImage");
            // logoImg.src =
            //   newTheme === "light" ? process.env.REACT_APP_MAIL_LOGO : process.env.REACT_APP_MAIL_LOGO;
            // logoImg.alt = `${mode} Logo`;

            e.currentTarget.title = `Switch to ${mode} Mode`;
          }}
        >
          <i
            id="themeIcon"
            class={`fas fa-${
              localStorage.getItem("theme") == "light" ? "moon" : "sun"
            }`}
          ></i>
        </div>

        <div
          id="editProfile"
          style={{ position: "relative" }}
          onClick={() => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.toggle("showUserDetails");
          }}
        >
          {(image !== undefined && image !== "") ? <img

            id="Profile-img"
            className="Profile-img"
            src={image !== undefined && image !== "" ? image : "/profile.png"}
            alt=""
          /> : <NameGenerator userName={userName} sizes={{ height: '30px', width: '30px', fontSize: '12px' }} />}
          
        </div>
        <div className="userDetails" ref={userDetailsRef}>
          <span className="line-loader"></span>
          <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <div className="popupImg">
              {(image !== undefined && image !== "") ? <img
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  maxWidth: "100%",
                  height: '80px', width: '80px',
                  display: 'block'
                }}
                src={
                  image !== undefined && image !== "" ? image : "/profile.png"
                }
                alt="Profile"
              /> :<NameGenerator userName={userName} sizes={{height: '80px', width: '80px', fontSize: '26px'}}/>}
             
              <i
                className="fas fa-pencil-alt edit-icon"
                onClick={handleClickOpen}
              ></i>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', }}>
              <div className="Navusername">{userName}</div>
              <div className="Navemail">{email}</div>
              <div className="Navrole">{role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => {
            // setLogoutPopupOpen(true)
            logoutDecider('All')
          }}>
            <button style={{ display: 'flex', alignItems: 'center' }}>
              <i
                className="fas fa-sign-out-alt"
                style={{ marginRight: "5px" }}
              ></i>{" "}
              Signout
            </button>
      
          </div>
        </div>

        <Dialog fullWidth
          open={helpPopOpen}
          onClose={() => { setHelpPopOpen(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"

        >
          <div style={{ padding: '10px' }}>
            Please drop a mail to <a href={`mailto:${process.env.REACT_APP_ADMIN_MAIL}`}>{process.env.REACT_APP_ADMIN_MAIL}</a>
            <button onClick={() => setHelpPopOpen(false)} style={{ float: 'right' }}>close</button>
          </div>

        </Dialog>

        <ProfileImageUpdate open={open} setOpen={setOpen} />

      </div>
    </div>
  );
};

export default Navbar;
