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
import { auth, fireDB, } from "../../firebase/Firebase.config";
import { Timestamp, addDoc, collection, getDocs, query, refEqual, where } from "firebase/firestore";
import { Loader } from "../../componets/Loader/Loader";
import { Authcontext } from "../../componets/contexts/Authcontext";
import { Transition } from "../../componets/Animation/Transition";
import { toast } from "react-toastify";
import { BsFillEyeFill } from "react-icons/bs";
import { IoArrowBackCircle, IoWarning } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { getStorage ,getDownloadURL,ref,uploadBytes} from "firebase/storage";
import "./../login/login.scss";
import { Header } from '../../componets/header/Header';
import { BsUpload } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
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
    profilePic,
    setProfilePic,
  } = useContext(Apicontext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [showPopup, setshowpopup] = useState(false);
 const [previewImage,setPreviewImage] =useState("")
  const [userdetail, setuserdetail] = useState();
  const [showbtn,setshowbtn]=useState(false)

  useEffect(() => {
    localStorage.getItem("user");
    
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if(auth.currentUser && auth.currentUser.emailVerified === false){
   
      handleauthdelete()
  }
   
  const handleauthdelete = async()=>{
    await deleteUser(auth.currentUser);
    toast.error("You cancelled the signup process")
  }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        const usersCollectionRef = collection(fireDB, 'users');
        console.log(usersCollectionRef,"usercolref");
        const querydata = query(usersCollectionRef, where("email", "==", user.email));
        console.log(querydata,"query");
        const querySnapshot = await getDocs(querydata);
        console.log(querySnapshot,"querySnapshot");
        if (querySnapshot.size > 0) {
          navigate("/"); // Redirect if user's email is found in the database
        } else {
          console.log("User email is not saved in the database");
    
          // Delete the user's authentication account
          await deleteUser(user);
    
          // Show a toast message to inform the user
          toast.error("Registration Timeout. Please Register again.");
        }
      }
    });
  
    return () => unsubscribe();
  }, []);


  useEffect(() => {

   

    const handleBeforeUnload = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && !user.emailVerified) {
          // User exists and email is not verified
          // Delete the user's email
          await deleteUser(user);
          console.log("User email deleted");
        }
      });

      return () => {
        // Unsubscribe when the component is unmounted
        unsubscribe();
      };
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        deleteUser(auth.currentUser);
        toast.error("You cancelled the signup process");
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setProfilePic(selectedFile);

    // You can also display the selected image preview
    if (selectedFile) {
      const previewImage = URL.createObjectURL(selectedFile);
      setPreviewImage(previewImage);
    }
  };
   const handleclosed =()=>{
      setPreviewImage("")
      setProfilePic(null)
   }


  const onClose = async () => {
    setloading(true)
    try {
      
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        console.log("user verified", auth.currentUser.emailVerified);

        const displayName = nickname;

        console.log("User before updateProfile:", auth.currentUser);
        await updateProfile(auth.currentUser, { displayName });
        console.log("User after updateProfile:", auth.currentUser);

        // Update local storage

        localStorage.setItem("nickname", nickname);

        // Inside your handlesignup function
        if (profilePic) {
          
          const user = auth.currentUser;
        
          const storage = getStorage();
          const storageRef = ref(storage, `profile-pics/${user.uid}`); // Use user's UID as part of the storage path
        
          // Upload the profile picture to storage
          await uploadBytes(storageRef, profilePic);
        
          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(storageRef);
        
          // Update user's profile with the photoURL
          await updateProfile(user, { photoURL: downloadURL });
          
          // Save the download URL to local storage
          localStorage.setItem("photoURL", downloadURL);
          
          // Update the profile picture state
          setProfilePic(downloadURL);
        }
        const isAdmin = userdetail.user.email === "ameencrews@gmail.com";
        setAuthadmin(isAdmin);
        localStorage.setItem("isAdmin", JSON.stringify(isAdmin));

        setAuthuser(true);
        setName("");
        setEmail("");
        setPassword("");
        setnickname("");
        const user = {
          name: name,
          nickname : nickname,
          uid: userdetail.user.uid,
          email: userdetail.user.email,
          time: Timestamp.now(),
        };
        const userref = collection(fireDB, "users");
        await addDoc(userref, user);

        console.log("Storing user in local storage:", user);
        localStorage.setItem("user", JSON.stringify(user));
       
        toast.success("Account created successfully..!");
        navigate("/");
        setloading(false)
      } else {
        console.log("user not verified", auth.currentUser.emailVerified);
        setloading(false)
        
        console.log("??");
        await auth.currentUser.delete();
        setName("");
        setEmail("");
        setPassword("");
        setnickname("");
        toast.error("Your Email is Not Verified. Please Sign Up Again");
        setshowpopup(false)
        
      }
    } catch (error) {
    
    setloading(false)
    await auth.currentUser?.delete();
    setName("");
    setEmail("");
    setPassword("");
    setnickname("");
      console.error("Error closing popup:", error.message);
      toast.error(error,"(Catch, network error please try again)")
      setshowpopup(false)
  };
  }
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

      toast.info("Please Check Your Mail For Verification");
      setloading(false);

      setshowpopup(true);

      setTimeout(() => {
         setshowbtn(true)
      }, 4000);
      setuserdetail(users);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This Email is already Used");
      } else {
        toast.error(error.message,"Network error 1");
      }
    } finally {
      setloading(false);
    }
  };

  const darkmode = classNames("main-login-card", { mode: !mode });

  return (
    <>
      <Transition>
      <Header/>
        <div className={darkmode}>
          
          <div className="login-card">
            <h2>Sign Up</h2>
            <form>
              {loading && <Loader />}
              {!previewImage ?(

              <>
              <label  style={{ marginBottom :' 15px' }} htmlFor="profilePic">Upload Profile Pic   <BsUpload /> </label>
              
              <input
               ref={inputRef}
                type="file"
                id="profilePic"
                name="profilePic"
                style={{display:'none'}}
                accept="image/*"
                multiple={false}
                onChange={handleFileInputChange}
              />
              </>
                ):(
                  <div style={{display : 'flex' , justifyContent :"center", alignItems:'center '}}>
                      <div style={{position :'relative' ,padding : '5px'}} >
                  <span onClick={handleclosed} style={{color : '#990011', right : '0px' ,top:'0px', fontSize:'20px',position :"absolute"}} ><MdCancel /></span>
                  <img src={previewImage} style={{border : '2px dotted #990011 ', maxWidth: '100%', maxHeight: '60px' }} />
                  </div>
                  </div>
                
                    )}
              
              <label htmlFor="NickName">FirstName</label>
              <input
               
                type="text"
                id="firstname"
                name="nickname"
                value={nickname}
                onChange={(e) => setnickname(e.target.value)}
              />
              <label htmlFor="FirstName">LastName</label>
              <input
               
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
              <label htmlFor="password">
                Password
                {password.length > 0 && (
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#990011",
                      marginRight: "8px",
                      position: "absolute",
                      right: "20px",
                    }}
                    onClick={handlechangebutton}
                  >
                    {showpassword ? <IoMdEyeOff /> : <BsFillEyeFill />}
                  </span>
                )}
              </label>
              <input
                type={showpassword ? "text" : "password"}
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
            <p style={{ fontFamily: "sans-serif", fontSize : '20px'}}> Check Your Mail For Verfication</p>
          </div>
          {showbtn &&

          <>
          <div>
            <button onClick={onClose}>Continue</button>
          </div>
          <IoWarning
            style={{
              color: "#ff9800",
              fontSize: "30px",
              fontFamily: "sans-serif",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p></p>
            <span
              style={{
                textAlign: "center",
                color: "black",
                fontSize: "14px",
                fontFamily: "sans-serif",
              }}
            >
              Note! Dont click "Continue" Before Your <br />
              Email Verification
            </span>
          </div>
          </>
           }
        </div>
      </div>
    </>
  );
};

export default Signup;
