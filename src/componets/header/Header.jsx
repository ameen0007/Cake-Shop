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
import { auth, fireDB } from "../../firebase/Firebase.config";
import { Loader } from "../Loader/Loader";
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { deleteObject, getStorage, ref ,getDownloadURL, list} from "firebase/storage";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";

export const Header = () => {
  const navigate = useNavigate();

  const { mode, setMode, changemode, loading,nickname, setnickname ,profilePic,setProfilePic,setloading,order} =
    useContext(Apicontext);
  const { authuser, setAuthuser, authadmin, setAuthadmin } =
    useContext(Authcontext);
const cartitem = useSelector((state)=> state.cart)

  const [toggle, settoggle] = useState(true);

  const [activeLink, setActiveLink] = useState("/");
  useEffect(() => {
    // Update active link when location changes
    setActiveLink(location.pathname);
  }, [location.pathname]);
  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("isAdmin");
    const storedPhotoURL = localStorage.getItem("photoURL");
    if (storedPhotoURL){
      setProfilePic(storedPhotoURL)
    }
    if (storedNickname) {
      setnickname(storedNickname);
    }

    if (storedAdmin) {
      const isAdmin = JSON.parse(storedAdmin);
      setAuthadmin(isAdmin);
    }
  }, []);

  const promptUserForReauthentication = async () => {
    return new Promise((resolve, reject) => {
      const password = prompt("Please enter your password to confirm account deletion:");
      
      if (password !== null && password !== "") {
        resolve(password);
      } else {
        reject(new Error("Password is required."));
      }
    });
  };
  


  const reauthenticateUser = async (user, password) => {
    const credentials = EmailAuthProvider.credential(user.email, password);
  
    try {
      await reauthenticateWithCredential(user, credentials);
      console.log("Reauthentication successful!");
    } catch (error) {
      if(error === 'auth/invalid-credential'){
        toast.error("Incorrect Password")
      }
      throw error;
    }
  };
  
  const deleteAccount = async () => {
    setloading(true)
    try {
      // Set loading to true
    
      
      const auth = getAuth();
      const user = auth.currentUser;
  
      // Prompt user for re-authentication
      const password = await promptUserForReauthentication();
      await reauthenticateUser(user, password);
  
      if (order.length > 0) {
        
        const userOrderDocs = order.filter((ord) => ord.userid === user.uid);
       
      console.log(userOrderDocs,"docs");
      
        userOrderDocs.forEach(async (orderDoc) => {
          try {
            // Delete the order document
            await deleteDoc(doc(fireDB, "order", orderDoc.id));
            console.log(`Order with ID ${orderDoc.id} deleted successfully`);
          } catch (error) {
            console.error(`Error deleting order with ID ${orderDoc.id}:`, error);
          }
        });
       
      }


      // Delete profile picture first
      const profilePicURL = user.photoURL;

      if (profilePicURL) {
        const user = auth.currentUser;
  
      const storage = getStorage();
       const profilePicRef = ref(storage, `profile-pics/${user.uid}`); // Reference to the profile picture based on user's UID

  // Delete the profile picture object from storage
    await deleteObject(profilePicRef);
      }
  
      // Create a batch for other deletions
      const batch = writeBatch(fireDB);
  
      // Query the users collection to find the document with the user's UID
      const usersCollectionRef = collection(fireDB, 'users');
      const q = query(usersCollectionRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      // Loop through the query results (should be only one result)
      querySnapshot.forEach((doc) => {
        // Get the document reference
        const userDocRef = doc.ref;
  
        // Add delete operation for the user document to the batch
        batch.delete(userDocRef);
        
          
        

      });


  
      // Commit the batch
      await batch.commit();
  
      // Delete user account
      await deleteUser(user);
  
      // Clear local storage or perform other necessary actions
      localStorage.clear();
  
      // Set states or perform other necessary actions
      setAuthadmin(false);
      setAuthuser(false);
      setnickname("");
      setProfilePic(""); // Clear profile picture if needed
  setloading(false)
      // Navigate or show success message
      toast.success("Account deleted successfully!");
      navigate("/");
      toggleswitch()

    } catch (error) {
      setloading(false)
      if(error.code === 'auth/invalid-credential'){
        toast.error("Incorrect Password")
      }
    }
  };
  
  const handleLinkClick = (path) => {
    setActiveLink(path);
    settoggle(!toggle);
    navigate(path);
  };

  const toggleswitch = () => {
    settoggle(!toggle);
  };
   console.log(profilePic,"profile");
  ///setting class to open left-div
  const toggleclass = classNames("left-div", { show: !toggle });

  const darkmode = classNames("nav", { mode: !mode });

  const handleLogout = () => {
    localStorage.clear();
    setAuthadmin(false);
    setAuthuser(false);
    setnickname("");
    settoggle(!toggle);
    toast.success("Logout Succesfully..!");
    navigate("/");
  };

  return (
    <div className={darkmode}>
      
      <div className="image">
        <img src="\logo1.png" alt="" />
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
           All Products
          </li>
          {loading && <Loader/>}
          {authuser && (
            <li
              onClick={() => handleLinkClick("/Orders")}
              className={activeLink === "/Orders" ? "active" : ""}
            >
             My Orders
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
          {/* <li
            onClick={() => handleLinkClick("/Contact")}
            className={activeLink === "/Contact" ? "active" : ""}
          >
            Contact Us
          </li> */}
        </ul>
        
        {authuser ? (
          <>
          <div className="btn1">
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="delete">
          <button onClick={deleteAccount} ><span>Delete My Account</span> </button>
          
          </div>
          </>
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
                    marginTop: "10px",
                    color: "a80417",
                    zIndex : '-90',
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
                    {profilePic ? (
                      <img style={{width : '40px',height:"40px",borderRadius:'100%',border : '1px solid #a80417',objectFit :'contain',marginBottom:'3px'}} src={profilePic} alt="" />
                    ):(
                      <FaCircleUser style={{ fontSize: "32px" ,marginBottom:'3px'}} />
                    )}
                   
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
