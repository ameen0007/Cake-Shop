import React, { useContext } from 'react';
import { HashLoader } from 'react-spinners';
import { Apicontext } from '../Context/Context';
import './loader.scss'

export const Loader = () => {
    
    const {mode,loading,} = useContext(Apicontext)

  return (
    <>
    {loading && 
    <div className={`loader-container ${loading ? 'blurred' : ''}`}>
    <HashLoader color="#990011"  size={50} />
  </div>}
  </>
  );
};
