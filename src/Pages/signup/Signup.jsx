import React, { useContext, useEffect, useRef, useState } from "react";
import { Noauthheader } from "../../componets/iconheader/Noauthheader";
import classNames from "classnames";
import { Apicontext } from "../../componets/Context/Context";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, fireDB } from "../../firebase/Firebase.config";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { Loader } from "../../componets/Loader/Loader";
import { Authcontext } from "../../componets/contexts/Authcontext";
import { Transition } from "../../componets/Animation/Transition";
import { toast } from "react-toastify";
import { BsFillEyeFill } from "react-icons/bs";
import {IoArrowBackCircle, IoWarning } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

import './../login/login.scss';

export const Signup = () => {
  const { setAuthuser, setAuthadmin } = useContext(Authcontext);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const {
    mode,
    loading,
    setloading,
    nickname,
    setnickname,
    showpassword,
    setshowpassword,
    handlechangebutton,
  } = useContext(Apicontext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [showPopup, setshowpopup] = useState(false);
  

const [userdetail,setuserdetail] = useState()
  useEffect(() => {
     localStorage.getItem('user');
     
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && !user.emailVerified) {
          // User exists and email is not verified
          // Delete the user's email
          await deleteUser(user);
          console.log('User email deleted');
          
        }
      });

      return () => {
        // Unsubscribe when the component is unmounted
        unsubscribe();
      };
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
   
    return () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        deleteUser(auth.currentUser);
        toast.error("You cancelled the signup process");
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  

  const onClose = async () => {
    try {
      setloading(true);
  
      await auth.currentUser.reload();
  
      if (auth.currentUser.emailVerified) {
        console.log("user verified", auth.currentUser.emailVerified);

        const displayName = nickname;

        console.log("User before updateProfile:", auth.currentUser);
      await updateProfile(auth.currentUser, { displayName });
       console.log("User after updateProfile:", auth.currentUser);

       

    // Update local storage
          
        localStorage.setItem('nickname', nickname);

      

        const isAdmin = userdetail.user.email === "ameencrews@gmail.com";
        setAuthadmin(isAdmin);
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
       
        



        setAuthuser(true);
        setName("");
        setEmail("");
        setPassword("");
        setnickname("")
        const user = {
          name: name,
          uid: userdetail.user.uid,
          email: userdetail.user.email,
          time: Timestamp.now(),
        };
        const userref = collection(fireDB, "users");
        await addDoc(userref, user);


        
  console.log('Storing user in local storage:', user);
     localStorage.setItem('user', JSON.stringify(user));


        toast.success("Account created successfully..!");
        navigate("/");
      } else {
        console.log("user not verified", auth.currentUser.emailVerified);
        await auth.currentUser.delete();
        setName("");
        setEmail("");
        setPassword("");
        setfirstName("");
        toast.error("Your Email is Not Verified. Please Sign Up Again");
      }
    } catch (error) {
      console.error('Error closing popup:', error.message);
      // Handle the error gracefully, e.g., show an error message to the user
    } finally {
      setloading(false); // Move setloading(false) inside finally block
      setshowpopup(false);
    }
  };
  
  

  const handlesignup = async (e) => {
    try {
      e.preventDefault();
      setloading(true);
  
      if (nickname === "" || name === "" || email === "" || password === "") {
        toast.error("All Fields Are Required");
        return;
      }
  
      if (nickname.length < 3 || nickname.length > 6) {
        toast.error("Firstname must be between 3 and 6 characters");
        return;
      }
  
      if (password.length <= 6) {
        toast.error("Password must be greater than 6 characters");
        return;
      }
  
      const users = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser);
  
      toast.info('Please Check Your Mail For Verification');
      setloading(false);
  
      
        setshowpopup(true);
      
  
      setuserdetail(users);
  
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This Email is already Used");
      } else {
        toast.error(error.message);
      }
    } finally {
      setloading(false);
    }
  };
  

  const darkmode = classNames("main-login-card", { mode: !mode });

  return (
    <>
      <Transition>
        <div className={darkmode}>
          <Noauthheader />
          <div className="back">
            <div>
              <span onClick={() => navigate("/")}>
                <IoArrowBackCircle />
              </span>
            </div>
            <div>
              <small onClick={() => navigate("/")}>To Home</small>
            </div>
          </div>
          <div className="login-card">
            <h2>Sign Up</h2>
            <form>
              {loading && <Loader />}
              <label htmlFor="NickName">FirstName</label>
              <input
                ref={inputRef}
                type="text"
                id="firstname"
                name="nickname"
                value={nickname}
                onChange={(e) => setnickname(e.target.value)}
              />
              <label htmlFor="FirstName">LastName</label>
              <input
                ref={inputRef}
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password">Password
                {password.length > 0 &&
                  <span
                    style={{
                      fontSize: "20px",
                      color: "black",
                      marginRight: "8px",
                      position: "absolute",
                      right: "20px",
                    }}
                    onClick={handlechangebutton}
                  >
                    {showpassword ? <IoMdEyeOff /> : <BsFillEyeFill />}
                  </span>
                }
              </label>
              <input
                type={showpassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <>
                <div className="sign">
                  <span>
                    Already Have an Account?
                    <small onClick={() => navigate("/Login")}> Login</small>
                  </span>
                </div>
                <button onClick={handlesignup}>Sign Up</button>
              </>
            </form>
          </div>
        </div>
      </Transition>
      <div className={`popup-overlay ${showPopup ? "active" : ""}`}>
        <div className={`popup ${showPopup ? "active" : ""}`}>
          <div>
            <p style={{ fontFamily :'sans-serif' }}>Please Check Your Mail</p>
          </div>
          <div>
            <button onClick={onClose}>Continue</button>
          </div>
          <IoWarning style={{ color: "#ff9800", fontSize: "30px", fontFamily: 'sans-serif' }} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p>
               </p>
            <span style={{  textAlign:'center',color: "black", fontSize: '14px', fontFamily: 'sans-serif' }}>
              Note! Dont click "Continue" Before Your <br />Email Verification</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
