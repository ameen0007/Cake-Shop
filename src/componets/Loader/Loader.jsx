import React, { useContext } from 'react';
import { PropagateLoader } from 'react-spinners';
import { Apicontext } from '../Context/Context';
import './loader.scss'

export const Loader = () => {
    
    const {mode,loading,} = useContext(Apicontext)

  return (
    <>
    {loading && 
    <div className={`loader-container ${loading ? 'blurred' : ''}`}>
    <PropagateLoader color="red" size={15} />
  </div>}
  </>
  );
};
