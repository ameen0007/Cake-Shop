
import React, { useContext, useEffect, useState } from "react";
import "./allproducts.scss";
import classNames from "classnames";

import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../../Redux/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { PiCakeBold } from "react-icons/pi";



import { FaArrowRightLong } from "react-icons/fa6";
import Rating from "react-rating-stars-component";
import { Apicontext } from "../../componets/Context/Context";
import { Authcontext } from "../../componets/contexts/Authcontext";
import { Transition } from "../../componets/Animation/Transition";
import { Header } from "../../componets/header/Header";
import { Filter } from "../../componets/Filter/Filter";
import { Loader } from "../../componets/Loader/Loader";

export const Allproducts = () => {

    const { authuser } = useContext(Authcontext);
    const {
      mode,
      setMode,
      changemode,
      product,
      searchkey,
      setsearchkey,
      filtertype,
      setfiltertype,
      filterprice,
      setfilterprice,
      setresultfound,
      loading,
      setloading,
    } = useContext(Apicontext);

    const darkmode = classNames("section4", { mode: !mode });
    const dispatch = useDispatch();
    const cartitem = useSelector((state) => state.cart);
    const navigate = useNavigate();
  
  console.log(loading,"value");
  
    const filteredProducts = product
      .filter((obj) => obj.title.toLowerCase().includes(searchkey))
      .filter((obj) => obj.category.toLowerCase().includes(filtertype))
      .filter((obj) => {
        if (filterprice) {
          const [filterMin, filterMax] = filterprice.split("-").map(Number);
  
          if (filterprice.includes("Under")) {
            return obj.price < filterMax;
          } else if (filterprice.includes("Upto")) {
            return obj.price >= filterMax;
          } else {
            return obj.price >= filterMin && obj.price <= filterMax;
          }
        }
        return true;
      });

      useEffect(() => {
        setfilterprice("")
        setfiltertype("")
        setsearchkey("")
        
      },[]);
  
    useEffect(() => {
      setresultfound(filteredProducts.length === 0);
    
    }, [filteredProducts, setresultfound]);
  
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cartitem));
    }, [cartitem]);
  
  
    const addcart = (product) => {
      if (authuser) {
        const timestampObject = {
          seconds: product.time.seconds,
          nanoseconds: product.time.nanoseconds,
        };
        const productWithSerializableTimestamp = {
          ...product,
          time: timestampObject,
        };
  
        dispatch(addtocart(productWithSerializableTimestamp));
        toast.success("Added to Cart")
      } else {
        navigate("/login");
      }
    };
  
   
  return (
    <Transition>
        <Header/>
        
    <section className={darkmode}>
    {loading && <Loader/>}
    <div className="h1">
      <h1 >
        All{" "}
        <span style={{ color: "#990011"}}>
        <PiCakeBold />{" "}
        </span>
        Products
      </h1>
    </div>
    <Filter />
    
        <div className="outer-div-card">
        {filteredProducts?.map((data, index) => {
          const currentPrice = data.price;
          const discountPrice = data.discountprice;
          const discountPercentage = ((currentPrice - discountPrice) / currentPrice) * 100;

          return (
            <div key={index} className="outline-card">
            
              <div
               
                className="card-div"
              >
                <div  onClick={() => navigate(`/Productinfo/${data.id}`)} className="img-div">
                  <img src={data.imageUrl} alt="" />
                </div>
              
              <div className="aside-div">
                <h3>{data.title}</h3>
                <div className="rating-div">
                  <p>{data.rating}</p>
                  <Rating
                    count={5}
                    value={parseFloat(data.rating)} // Convert the rating to a number
                    size={20}
                    edit={false}
                    isHalf={true}
                    activeColor="#ffd700"
                  />
                </div>
                <div className="price-div">
                  <h2 style={{ textDecoration: "line-through" }}>
                    ₹{data.discountprice}
                  </h2>
                  <h2 style={{ color: "#990011" }}>₹ {data.price}</h2>
                  <h2 style={{ color: "#990011" }} >
               -{Math.abs(Math.round(discountPercentage))}
                <small>%</small>{" "}
              </h2>
                </div>
               
                <div className="btn-div">
                <button onClick={() => addcart(data)}>Add To Cart</button>
              </div>
              </div>
             
              </div>
            </div>
          );
        })}
      </div>
 </section>
 </Transition>
  )
}
