import React, { useContext, useEffect, useState } from "react";
import { Apicontext } from "../../../../componets/Context/Context";
import { Loader } from "../../../../componets/Loader/Loader";
import "./orders.scss";
import { Header } from "../../../../componets/header/Header";
import { fireDB } from "../../../../firebase/Firebase.config";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

export const Orders = () => {
  const userid = JSON.parse(localStorage.getItem("user")).user.uid;
  const { getOrderData, loading, order, setloading } = useContext(Apicontext);


  console.log(order.id, "order");

  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    getOrderData();
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        console.log("Fetching order data...");
        await getOrderData();
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        // Set loading to false when done fetching
        setloading(false);
      }
    };

    // Fetch order data if loading is true and there is no order data
    if (loading && order.length === 0) {
      fetchOrderData();
    }
  }, [getOrderData, order, loading, setloading]);

  useEffect(() => {
    // Update orderStatus when the order state changes
    const latestOrder = order.find((obj) => obj.userid === userid);
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
      console.log(order, "order"); // Log the entire order object
      console.log(order.id, "order id");
  
      // Use deleteDoc to delete the document with the correct order ID
      await deleteDoc(doc(fireDB, "order", order.id));
  
      toast.success("Cancelled your order");
  
      // Optionally, you can fetch order data again after deletion
      await getOrderData();
  
      setloading(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setloading(false);
    }
  };

  return (
    <>
      <Header />
      {loading && <Loader />}
      {order.length > 0 ? (
        <div className="order-container">
          <h1>My Orders</h1>
          {order
            .filter((obj) => obj.userid === userid)
          
            .map((ordere, orderIndex) => (
              <div key={orderIndex} className="order-item">
            
                {ordere.caritems?.map((item, itemIndex) => (
                  <div key={itemIndex} className="item-container">
                    <div className="img-container">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                 
                    <div className="details">
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      <p>₹ {item.price}</p>
                      <br />
                      <p>
                        Order Status: <br />{" "}
                        <span style={{ color: "green", fontWeight: "600" }}>
                          {orderStatus}
                        </span>
                      </p>
                      <br />
                      <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
            backgroundColor: "#f0f0f0",
          }}
        >
          <img
            src="https://cdn.dribbble.com/users/9620200/screenshots/17987839/media/fd60cc8251e50a8c54d3dde620ff9460.jpg?resize=400x300&vertical=center"
            alt=""
          />
        </div>
      )}
    </>
  );
};
