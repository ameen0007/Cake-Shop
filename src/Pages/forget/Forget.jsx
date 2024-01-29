import React, { useContext, useEffect, useRef, useState } from 'react';
import { Noauthheader } from '../../componets/iconheader/Noauthheader';
import classNames from 'classnames';
import { Apicontext } from '../../componets/Context/Context';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5';
import { Transition } from '../../componets/Animation/Transition';
import { auth, fireDB } from '../../firebase/Firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Loader } from '../../componets/Loader/Loader';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Forget = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { mode, loading, setloading } = useContext(Apicontext);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const q = query(collection(fireDB, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data(); // Retrieve the document data
    
        if (userDoc.email) {
          await sendPasswordResetEmail(auth, email);
          toast.success('Check your email for password reset instructions.');
          setloading(false);

          setTimeout(() => {
            navigate('/Login');
          }, 2000);
      }
    } else {
      toast.error('This email address is not registered. Please sign up.');
      setloading(false);
    }
      
    } catch (error) {
      toast.error('Oops Something Went Wrong.');
      setloading(false);
    }
  }; 

  
  
  const darkmode = classNames('main-login-card', { 'mode': !mode });

  return (
    <Transition>
      <div className={darkmode}>
        <Noauthheader />
        <div className='back'>
          <div>
            <span onClick={() => navigate('/')}><IoArrowBackCircle /></span>
          </div>
          <div>
            <small onClick={() => navigate('/')} >To Home</small>
          </div>
        </div>
        <div className="login-card">
          {loading &&
            <Loader />
          }
          <h2>Forget Password</h2>
          <form onSubmit={handlePasswordReset}>
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
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </Transition>
  );
};
