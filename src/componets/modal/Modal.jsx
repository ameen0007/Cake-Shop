import React, { useContext, useState } from 'react'
import './modal.scss'
import { Apicontext } from '../Context/Context';


export const Modal = ({isOpen,onClose, name, address, pincode, phoneNumber, setName, setAddress, setPincode, setPhoneNumber,buynow}) => {
  const {mode} = useContext(Apicontext)
  
  const backgroundColor = mode ? '#fcf6f5' : 'rgb(16, 15, 15)';

  return (
    <div style={{backgroundColor }} className={`order-modal ${isOpen ? 'open' : ''}`}>
    <div style={{backgroundColor}} className="modal-content">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <h2>Order Now</h2>
      <label>
         Enter Full Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
         Enter Full Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label>
         Enter Pin Code:
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          required
        />
      </label>
      <label>
         Enter Mobile Number:
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </label>
      <button onClick={() => { 
  try {
    buynow(); 
    onClose(); 
  } catch (error) {
    console.error('An error occurred during order processing:', error);
    
  }
}}>Order Now</button>
    </div>
  </div>
  )
}
