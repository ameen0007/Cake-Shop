import React, { useContext, useState } from 'react'
import { MdLightMode } from "react-icons/md"
import { MdDarkMode } from "react-icons/md";
import './noauth.scss'
import { Apicontext } from '../Context/Context';
import classNames from 'classnames';

export const Noauthheader = () => {
    const {mode,changemode} = useContext(Apicontext)
    const darkmode = classNames("noauthmaindiv",{"mode":!mode})
  return (
    <div className={darkmode}>
         <div className='imgcon'>
            <img src="src\assets\logo1.png" alt="" />
         </div>
         <div className='dark'>
            {mode? (
            <span onClick={changemode}><MdLightMode/></span>
            ):(
            <span onClick={changemode}><MdDarkMode/></span>
            )
            }
         </div>
    </div>
  )
}
