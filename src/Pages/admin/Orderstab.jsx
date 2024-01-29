import React, { useContext, useState } from 'react'
import './orderstab.scss'
import { Apicontext } from '../../componets/Context/Context'
export const Orderstab = () => {
  const {order, updateOrderStatus} = useContext(Apicontext)
  const [selectedStatus, setSelectedStatus] = useState('');
  const handleStatusChange = (orderId) => {
    console.log(orderId,"id");
    updateOrderStatus(orderId, selectedStatus);
  
  };
  return (
    <div>
      <h2>Orders</h2>
      {order.map((allorders, index) => {
        console.log(allorders, "all orders");
        return (
          <div key={index} className="Orderstab-Container">
            <p>S.No. {index + 1}</p>
            <p>Payment ID: {allorders.paymentId}</p>
            
            
            {allorders.caritems.map((item, itemIndex) => (
              <div key={itemIndex}>
                <img src={item.imageUrl} alt="Product" />
                <p>Title: {item.title}</p>
                <p>Price: {item.price}</p>
                <p>Category: {item.category}</p>
              </div>
            ))}
            <p>Name: {allorders.addressinfo.name}</p>
            <p>Address: {allorders.addressinfo.address}</p>
            <p>Pincode: {allorders.addressinfo.pincode}</p>
            <p>Phone Number: {allorders.addressinfo.phoneNumber}</p>
            <p>Email: {allorders.email}</p>
            <p>Date: {allorders.date}</p>
            <p>Order status : {allorders.addressinfo.orderstatus}</p>
             
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Update Status</option>
              <option value="Shipped">Shipped</option>
              <option value="Preparing For Dispatch">Preparing For Dispatch</option>
              <option value="Delivered">Delivered</option>
            </select>

           
            <button onClick={() => handleStatusChange(allorders.id)}>
              Update Status
            </button>

          </div>
        );
      })}
    </div>
  )
}
