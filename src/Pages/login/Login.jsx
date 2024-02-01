import React, { useContext, useEffect, useRef, useState } from 'react'
import './login.scss'
import { Noauthheader } from '../../componets/iconheader/Noauthheader';
import classNames from 'classnames';
import { Apicontext } from '../../componets/Context/Context';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from "react-icons/io5";
import { QuerySnapshot, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDB } from '../../firebase/Firebase.config';

import { Transition } from '../../componets/Animation/Transition';
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/Firebase.config';
import { toast } from 'react-toastify';
import { Loader } from '../../componets/Loader/Loader';
import { Authcontext } from '../../componets/contexts/Authcontext';
import { Header } from '../../componets/header/Header';


export const Login   = () => {
  
  const navigate = useNavigate()
  const inputRef = useRef(null);
  const {mode,loading,setloading,setnickname,nickname,profilePic,
    setProfilePic,} = useContext(Apicontext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {authuser,setAuthuser,setAuthadmin} = useContext(Authcontext)
 

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

  }, []); 

  const handleLogin = async (e) => {
    e.preventDefault();
      setloading(true)

      try {
     

        const result = await signInWithEmailAndPassword(auth, email, password);
      
        // If the above line is successful, the email and password are correct
        localStorage.setItem('user', JSON.stringify(result));
  
        const isAdmin = result.user.email === 'ameencrews@gmail.com';
        setAuthadmin(isAdmin);
        setAuthuser(true);
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  
        try {
          const nickname = result.user.displayName;
          
          localStorage.setItem('nickname', nickname);
          setnickname(nickname);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
        
        if (auth.currentUser.photoURL) {
           const profilepic = auth.currentUser.photoURL
           console.log(profilePic,"profile pic");
          localStorage.setItem("photoURL", profilepic);
          setProfilePic(profilepic)
        }
        



          
  
        
        toast.success('Login successful');
        setloading(false);
        navigate('/');
      } catch (error) {
         if(error.code === 'auth/invalid-credential'){
         
          toast.error('User Not Found Or Password Is Incorrect.');
          setloading(false)
        }else {
          console.log(error);
          toast.error('Login failed. Please try After some time.');
          setloading(false)
        }
        setloading(false);
      }
    };





  const darkmode = classNames("main-login-card",{"mode":!mode})
  return (
  <Transition>
    <Header/>
<div  className={darkmode} 
>

<div className="login-card">
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
    {
    loading && <Loader/>
  } 
      <label htmlFor="email">Email</label>
      <input
      ref={inputRef}
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
        <div className='sign'>
           <span> New User ?<small onClick={()=> navigate('/Signup')} > Register</small></span>
        </div>
        <div className='forget'>
          <span  onClick={()=> navigate('/Forget')} >Forget password ?</span>
        </div>
      <button type="submit">Login</button>
    </form>
  </div>
</div>
</Transition>
)
  }
