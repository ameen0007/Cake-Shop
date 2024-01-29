import React, { useContext, useEffect, useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import "./header.scss";
import classNames from "classnames";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { Apicontext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { Authcontext } from "../contexts/Authcontext";
import { toast } from "react-toastify";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";

export const Header = () => {
  const navigate = useNavigate();

  const { mode, setMode, changemode, nickname, setnickname } =
    useContext(Apicontext);
  const { authuser, setAuthuser, authadmin, setAuthadmin } =
    useContext(Authcontext);
const cartitem = useSelector((state)=> state.cart)

  const [toggle, settoggle] = useState(true);

  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("isAdmin");
  
    if (storedNickname) {
      setnickname(storedNickname);
    }

    if (storedAdmin) {
      const isAdmin = JSON.parse(storedAdmin);
      setAuthadmin(isAdmin);
    }
  }, []);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    settoggle(!toggle);
    navigate(path);
  };

  const toggleswitch = () => {
    settoggle(!toggle);
  };

  ///setting class to open left-div
  const toggleclass = classNames("left-div", { show: !toggle });

  const darkmode = classNames("nav", { mode: !mode });

  const handleLogout = () => {
    localStorage.clear();
    setAuthadmin(false);
    setAuthuser(false);
    setnickname("");
    settoggle(!toggle);
    toast.success("Lgout Succesfully..!");
    navigate("/");
  };

  return (
    <div className={darkmode}>
      <div className="image">
        <img src="src\assets\logo1.png" alt="" />
      </div>
      <div className={toggleclass}>
        {!toggle && (
          <div className="close">
            <span onClick={toggleswitch}>
              <IoClose />
            </span>
          </div>
        )}

        <ul>
          <li
            onClick={() => handleLinkClick("/")}
            className={activeLink === "/" ? "active" : ""}
          >
            Home
          </li>
          <li
            onClick={() => handleLinkClick("/Products")}
            className={activeLink === "/Products" ? "active" : ""}
          >
            Products
          </li>
          {authuser && (
            <li
              onClick={() => handleLinkClick("/Orders")}
              className={activeLink === "/Orders" ? "active" : ""}
            >
              Orders
            </li>
          )}
          {authadmin && (
            <li
              onClick={() => handleLinkClick("/Admin")}
              className={activeLink === "/Admin" ? "active" : ""}
            >
              Admin
            </li>
          )}
          <li
            onClick={() => handleLinkClick("/Contact")}
            className={activeLink === "/Contact" ? "active" : ""}
          >
            Contact Us
          </li>
        </ul>
        {authuser ? (
          <div className="btn1">
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="btn1">
            <button onClick={() => handleLinkClick("/Login")}> Login</button>
          </div>
        )}
      </div>
      <div className="dark">
        <>
          <div className="modediv">
            {mode ? (
              <span onClick={changemode}>
                <MdDarkMode />
              </span>
            ) : (
              <span onClick={changemode}>
                <MdLightMode />
              </span>
            )}
            {authuser && (
              <div  style={{
                 
                 position : 'relative'
              }}>
              {cartitem.length > 0 &&
            <small style={{
                 backgroundColor : '#a80417',
                 position : 'absolute', 
                 fontSize : '14px',
                 color:"white",
                 fontWeight : '600',
                bottom : '45px',
                 minWidth : '18px',
                 minHeight : '17px',
              
                 textAlign : 'center',
                 fontFamily : 'sans-serif',
                 borderRadius : '100%',
                 left : '14px'
              }} >{cartitem.reduce((total, item) => total + item.quantity, 0)}</small>
            }

               <li onClick={() => handleLinkClick("/Cart")}
                className={activeLink === "/Cart" ? "active" : ""}
              >
                
                <FaShoppingCart
                  style={{
                    fontSize: "35px",
                    marginTop: "25px",
                    color: "#a80417",
                  }}
                />
                </li> 
              </div>
            )}
            <div className="btn">
              <button onClick={() => navigate("/Login")}>Login</button>
            </div>
            {!authuser ? (
              <small className="more" onClick={toggleswitch}>
                <FaBarsStaggered
                  style={{ fontSize: "38px", marginTop: "10px" }}
                />
              </small>
            ) : (
              <div className="usericon">
                <div className="innericon">
                  <span onClick={toggleswitch}>
                    <FaCircleUser style={{ fontSize: "38px" }} />
                  </span>
                </div>
                {nickname && (
                  <small onClick={toggleswitch}>Hi..{nickname}</small>
                )}
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};
