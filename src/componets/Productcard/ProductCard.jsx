import React, { useContext, useEffect, useState } from "react";
import "./productcard.scss";
import classNames from "classnames";
import { Apicontext } from "../Context/Context";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../../Redux/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Rating from "react-rating-stars-component";
import { FaBoltLightning } from "react-icons/fa6";
import { Authcontext, Authprovide } from "../contexts/Authcontext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


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
    } else {
      navigate("/login");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjust the number of slides to show based on your design
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <section className={darkmode}>
      <div className="productcardmain">
        <div className="h1">
          <h1 style={{ marginBottom: "20px" }}>
            Our Trending{" "}
            <span style={{ color: "#990011" }}>
              <FaBoltLightning />{" "}
            </span>
            Products
          </h1>
        </div>



        {/* //  from // */}
        <div className="card-div " >
           <Slider {...settings}>
            {filteredProducts?.map((data, index) => {
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
             </Slider>
             </div>
        {/* //  to // */}
      </div>
    </section>
  );
};