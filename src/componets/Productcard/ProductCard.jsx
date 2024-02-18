import React, { useContext, useEffect, useState } from "react";
import "./productcard.scss";
import classNames from "classnames";
import { Apicontext } from "../Context/Context";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../../Redux/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { FaBoltLightning } from "react-icons/fa6";
import { Authcontext, Authprovide } from "../contexts/Authcontext";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import { FaArrowRightLong } from "react-icons/fa6";
import Rating from "react-rating-stars-component";


export const ProductCard = () => {
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
  } = useContext(Apicontext);
  const darkmode = classNames("section3", { mode: !mode });
  const dispatch = useDispatch();
  const cartitem = useSelector((state) => state.cart);
  const navigate = useNavigate();






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
    
    <section className={darkmode}>
      
        <div className="h1">
          <h1 style={{ marginBottom: "20px" }}>
            Our Trending{" "}
            <span style={{ color: "#990011" }}>
              <FaBoltLightning />{" "}
            </span>
            Products
          </h1>
        </div>
        
        <AliceCarousel
         autoPlay
         autoPlayInterval={2000}
        responsive={{
          0: { items: 1 },
          600: { items: 2 },
          1024: { items: 4 },
        }}
        buttonsDisabled={true} 
        
           infinite={true} 
           dotsDisabled={false}
           stagePadding={{ paddingLeft: 20, paddingRight: 20 }}>

            {product?.map((data, index) => {
              const currentPrice = data.price;
              const discountPrice = data.discountprice;
              const discountPercentage = ((currentPrice - discountPrice) / currentPrice) * 100;

              return (
                <div key={index} className="inside-card">
                  <h3>
                    -{Math.abs(Math.round(discountPercentage))}
                    <small>%</small>{" "}
                  </h3>
                  <div
                    onClick={() => navigate(`/Productinfo/${data.id}`)}
                    className="imagediv"
                  >
                    <div className="showimg">
                      <img src={data.imageUrl} alt="" />
                    </div>
                  </div>
                  <div className="bottom">
                    <h2>{data.title}</h2>
                    <div className="inner-bottom">
                      <h2 style={{ textDecoration: "line-through" }}>
                        ₹{data.discountprice}
                      </h2>
                      <h2 style={{ color: "#990011" }}>₹ {data.price}</h2>
                    </div>
                    <div className="rating">
                      <p>{data.rating}</p>
                      <Rating
                        count={5}
                        value={parseFloat(data.rating)} // Convert the rating to a number
                        size={24}
                        edit={false}
                        isHalf={true}
                        activeColor="#ffd700"
                      />
                    </div>
                  </div>
                  <div className="btn">
                    <button onClick={() => addcart(data)}>Add To Cart</button>
                  </div>
                </div>
              );
            })}
    </AliceCarousel>
    <div className="btncon">
      <button onClick={()=>navigate('/Products')} >
        See All Products<span style={{position:"absolute",top:'29%',color:'white', fontSize:'18px',marginLeft:'5px' }} >< FaArrowRightLong /></span>
      </button>
    </div>
     </section>
     
    
  );
};