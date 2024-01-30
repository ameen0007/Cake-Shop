import React, { useContext, useEffect } from "react";
import "./productcard.scss";
import classNames from "classnames";
import { Apicontext } from "../Context/Context";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../../Redux/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ProductCard = () => {
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
  const navigate = useNavigate()

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
    const timestampObject = {
      seconds: product.time.seconds,
      nanoseconds: product.time.nanoseconds,
    };
    const productWithSerializableTimestamp = {
      ...product,
      time: timestampObject,
    };

    dispatch(addtocart(productWithSerializableTimestamp));
  };



  return (
    <section className={darkmode}>
      <div className="productcardmain">
        <div className="h1">
          <h1>Our New Products</h1>
        </div>

        <div className="card-div">
          {
         
            filteredProducts.map((data, index) => (
            
              <div key={index}  className="inside-card">
                <div onClick={()=> navigate(`/Productinfo/${data.id}`)} className="imagediv">
                  <div className="showimg">
                    <img src={data.imageUrl} alt="" />
                  </div>
                </div>
                <div>
                  <h2>{data.title}</h2>
                  <h2>₹ {data.price}</h2>
                  <div className="btn">
                    <button onClick={() => addcart(data)}>Add To Cart</button>
                  </div>
                </div>
              </div>

            ))
          }
        </div>

      </div>
    </section>
  );
};
