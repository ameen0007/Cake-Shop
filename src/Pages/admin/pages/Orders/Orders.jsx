import React, { useContext, useEffect, useState } from "react";
import { Apicontext } from "../../../../componets/Context/Context";
import { Loader } from "../../../../componets/Loader/Loader";
import "./orders.scss";
import { Header } from "../../../../componets/header/Header";
import { fireDB } from "../../../../firebase/Firebase.config";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
  const { getOrderData, loading, order, setloading, mode } = useContext(Apicontext);
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("");
  const [userid, setUserid] = useState(""); // Declare userid state

   console.log(order,"order");

  useEffect(() => {
    getOrderData();
  }, [orderStatus]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        console.log("Fetching order data...");
        await getOrderData();
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setloading(false);
      }
    };

    if (loading && order.length === 0) {
      fetchOrderData();
    }
  }, [getOrderData, order, loading, setloading]);

  useEffect(() => {
    // Move the declaration of userid here
    const userid = JSON.parse(localStorage.getItem("user"))
    const userIdFromLocalStorage = userid.user ? userid.user.uid :userid.uid
  
    if (userIdFromLocalStorage) {
      setUserid(userIdFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    // Access userid within this useEffect
    const latestOrder = order.find((obj) => obj.userid === userid);
    console.log(userid,"userid");
    console.log(order.length,"orders");
    if (latestOrder) {
      setOrderStatus(latestOrder.addressinfo.orderstatus);
      console.log("Order Status:", latestOrder.addressinfo.orderstatus);
    } else {
      console.log("No order found for the user");
    }
  }, [order, userid]);
 
  const handleCancelOrder = async (order) => {
    setloading(true);
    try {
      console.log(order, "order"); 
      console.log(order.id, "order id");
  
      
      await deleteDoc(doc(fireDB, "order", order.id));
     
      toast.success("Cancelled your order");
  
      await getOrderData();
  
      setloading(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setloading(false);
    }
  }
   
  const darkmode = classNames("order-container", { mode: !mode });
  const darkmode2 = classNames("order-item", { mode: !mode });
  const darkmode3 = classNames("item-container", { mode: !mode });
  const backgroundColor = mode ? '#fcf6f5' : 'rgb(16, 15, 15)';
  return (
    <>
      <Header />
      {loading && <Loader />}
{order.filter((obj) => obj.userid === userid).length > 0 ? (
  <div className={darkmode}>
    <h1>My Orders</h1>
    {order
      .filter((obj) => obj.userid === userid)
      .map((ordere, orderIndex) => (
        <div key={orderIndex} className={darkmode2 }>
          {ordere.caritems?.map((item, itemIndex) => (
            <div key={itemIndex} className={darkmode3}>
              <div onClick={() => navigate(`/Productinfo/${item.id}`)}  className="img-container">
                <img src={item.imageUrl} alt={item.title} />
              </div>
              <div className="details">
                <h2>{item.title}</h2>
                <p style={{color : '#990011',fontWeight:'700'}}>₹ {item.price}</p>
                <p >
                  Order Status: {" "}
                  <span style={{ color : 'green' ,fontWeight:'700', fontFamily:'sans-serif'}} >
                    {ordere.addressinfo.orderstatus}
                  </span>
                </p>
                <div>
                  <button onClick={() => handleCancelOrder(ordere)}>
                    Cancel My Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
  </div>
) : (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor 
    }}
  >
    <img style={{width : '50% '}}
      src="noorder.png"
      alt=""
    />
  </div>
)}

    </>
  );
};
