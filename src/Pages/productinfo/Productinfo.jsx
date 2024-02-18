import React, { useContext, useEffect, useState } from 'react'
import './productinfo.scss'
import classNames from "classnames";
import { Transition } from '../../componets/Animation/Transition';
import { Apicontext } from '../../componets/Context/Context';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/Firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { addtocart } from '../../Redux/cartSlice';
import { toast } from 'react-toastify';
import { Loader } from '../../componets/Loader/Loader';
import StarRatings from 'react-star-ratings';
import { Header } from '../../componets/header/Header';


export const Productinfo = () => {
   const navigate = useNavigate()
  const {loading,setloading,mode} = useContext(Apicontext)
  
  const [product,setproduct]= useState("")
  const params = useParams()

  const getproductdata = async()=>{
    setloading(true)
    try {
       
      const producttemp = await getDoc(doc(fireDB,'productsitem',params.id))
      setproduct(producttemp.data())
      setloading(false)

    } catch (error) {
      console.log(error);
      setloading(false)
    }
  }

  useEffect(() => {
    getproductdata()
  }, [])
  
  const dispatch = useDispatch()
  const cartitem = useSelector((state)=> state.cart)

  const addcart = (product)=>{
    const timestampObject = {
      seconds: product.time.seconds,
      nanoseconds: product.time.nanoseconds,
    };
  
    const productWithSerializableTimestamp = {
      ...product,
      time: timestampObject,
    };
  
    dispatch(addtocart(productWithSerializableTimestamp));
    toast.success("Added successfully");
    setTimeout(() => {
      navigate('/cart')
    }, 1000);
  }

   useEffect(() => {
     localStorage.setItem('cart',JSON.stringify(cartitem))
   }, [cartitem])
   
   const currentPrice = product.price;
   const discountPrice = product.discountprice;
   const discountPercentage = ((currentPrice - discountPrice) / currentPrice) * 100;
   const darkmode = classNames("product-info-container", { mode: !mode });
  return (
   <Transition>
  
      {loading && <Loader/>}
      <Header/>
    <div className={darkmode}>
    <div className='heading'><p>Product Details</p></div>
      <div className="product-img-container">
        
        <img
          src={product?.imageUrl} // Replace with your actual image source
          alt="Product"
        />
      </div>
      <div className="product-details">
        <h2>{product?.title}</h2>
        <p>
          {product?.description}
        </p>
        <div className='rating'>
        <p>
          {product?.rating}
          </p>
         
         {console.log("Product rating:", product.rating)}
         <StarRatings
  rating={product.rating ? parseFloat(product.rating) : 0} // Handle undefined values
  starRatedColor="#ffd700"
  numberOfStars={5}
  name='rating'
  starEmptyColor="grey"
  starHoverColor="#ffd700"
  starDimension="20px"
  starSpacing="2px"
  editing={false}
  isHalf={true}
/>

        </div>
       
  
      <div  className="price">
      <h2>₹ 
          {product?.discountprice}
        </h2>

        <p>₹ {product.price}</p>
        <h3 >
                    -{Math.abs(Math.round(discountPercentage))}
                    <small>% </small>{" "}
                  </h3>
      </div>
          
        <button onClick={()=>addcart(product)} className="add-to-cart-btn">Add to Cart</button>
      </div>

    </div>
    </Transition>
  )
}
