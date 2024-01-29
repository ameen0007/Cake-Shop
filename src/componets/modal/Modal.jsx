import React, { useState } from 'react'
import './modal.scss'


export const Modal = ({isOpen,onClose, name, address, pincode, phoneNumber, setName, setAddress, setPincode, setPhoneNumber,buynow}) => {




  return (
    <div className={`order-modal ${isOpen ? 'open' : ''}`}>
    <div className="modal-content">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <h2>Order Now</h2>
      <label>
        1. Enter Full Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        2. Enter Full Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <label>
        3. Enter Pin Code:
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
      </label>
      <label>
        4. Enter Mobile Number:
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>
      <button onClick={() => { buynow(); onClose(); }}>Order Now</button>
    </div>
  </div>
  )
}
