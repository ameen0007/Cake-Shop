import React, { useContext, useEffect } from 'react'
import './usertab.scss'
import { Apicontext } from '../../../componets/Context/Context';
import { auth } from '../../../firebase/Firebase.config';

export const UsersTab = () => {
  
  
  const { getOrderData, loading, user, setloading } = useContext(Apicontext);
  console.log(user);
  const formatTimestamp = (timestamp) => {
    const dateObject = timestamp.toDate();
    return dateObject.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const name = auth.currentUser.displayName
  return (
    <div>
       <h2>Users</h2>
 {user.map((item,index)=>{
  return(
   
    <div key={index} className='UsersTab-Container'>
      <p>No: {index +1}</p>
      <p>Name: {name} {item.name}</p>
      
      <p>Email: {item.email}</p>
      <p>Date:{formatTimestamp(item.time)}</p>
    </div>
  )
 })}
    

  </div>
  )
}
