import React, { useState } from "react";
import "./cart.scss";
import { Modal } from "../../componets/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  addtocart,
  deletefromcart,
  decrementQuantity,
  clearCart,
} from "../../Redux/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Header } from "../../componets/header/Header";
import { Transition } from "../../componets/Animation/Transition";
import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/Firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const caritems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  console.log(caritems, "??");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOrderNowClick = () => {
    // Open the modal when "Order Now" button is clicked
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setModalOpen(false);
  };

  const handleIncrement = (itemId) => {
    // Dispatch an action to increment the quantity of the item
    dispatch(addtocart(caritems.find((item) => item.id === itemId)));
  };

  const handleDecrement = (itemId) => {
    // Dispatch an action to decrement the quantity of the item
    dispatch(decrementQuantity({ id: itemId }));
  };

  const subtotal = caritems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCost = 40;

  // Calculate total by adding subtotal and shipping cost
  const total = subtotal + shippingCost;

  const handledeletecart = (dataid) => {
    dispatch(deletefromcart(dataid));
  };

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderstatus,setorderstatus] = useState("Preparing For Dispatch")
  const buynow = () => {
    console.log("hii");
    if (name === "" || address == "" || pincode == "" || phoneNumber == "") {
      return toast.error("All fields are required");
    }

    const addressinfo = {
      name,
      address,
      pincode,
      phoneNumber,
      orderstatus,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    var options = {
      key: "rzp_test_sFT2B5XULMCPAy",
      key_secret: "CxvzWJsjgUOQTMYd2f3gxW3x",
      amount: parseInt(total * 100),
      currency: "INR",
      order_receipt: "order_rcptid_" + name,
      name: "Sweet Bite",
      description: "for testing purpose",
      handler: function (response) {
        console.log(response);
        toast.success("Payment Successful");

        const paymentId = response.razorpay_payment_id;
        const orderinfo = {
          caritems,
          addressinfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: JSON.parse(localStorage.getItem("user")).user.email,
          userid: JSON.parse(localStorage.getItem("user")).user.uid,
          paymentId,
        };
        try {
          const orderref = collection(fireDB, "order");
          addDoc(orderref, orderinfo);
          dispatch(clearCart());
          
        } catch (error) {
          console.log(error);
        }
      },

      theme: {
        color: "#3399cc",
      },
    };

    var pay = new window.Razorpay(options);
    pay.open();
    
    
    console.log(pay);
  };

  return (
    <Transition>
      
      {caritems.length > 0 ? (
        <>
         <Header />
      <div className="cart-page-container">
        <div className="cart-items">
          <h2>Cart Items</h2>

          {caritems.map((data) => {
            return (
              <div key={data.id} className="product-item">
                <img
                  src={data.imageUrl} // Reace wiplth your actual image source
                  alt="Product"
                />
                <div className="product-details">
                  <h3>{data.title}</h3>
                  <p>{data.description}</p>
                  <p className="price">₹ {data.price}</p>
                  <p>Quantity: {data.quantity}</p>
                  <div className="quantity-buttons">
                    <button onClick={() => handleDecrement(data.id)}>-</button>
                    <button onClick={() => handleIncrement(data.id)}>+</button>

                    <span onClick={() => handledeletecart(data.id)}>
                      <RiDeleteBin6Line />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="subtotal">
            <p>Subtotal:₹ {subtotal}</p>
          </div>
          <div className="shipping">
            <p>Shipping: ₹{shippingCost}</p>
          </div>
          <div className="total">
            <h1>Total: ₹{total}</h1>
          </div>
          <button className="buy-now-btn" onClick={handleOrderNowClick}>
            Buy Now
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            name={name}
            address={address}
            pincode={pincode}
            phoneNumber={phoneNumber}
            setName={setName}
            setAddress={setAddress}
            setPincode={setPincode}
            setPhoneNumber={setPhoneNumber}
            buynow={buynow}
          />
        </div>
      </div>
      </>
      ):(
        <div>
          <img src="https://w7.pngwing.com/pngs/432/660/png-transparent-empty-cart-illustration-thumbnail.png" alt="" />
          <h1>Cart Is Empty</h1>
        </div>
      )}
    </Transition>
  );
};
