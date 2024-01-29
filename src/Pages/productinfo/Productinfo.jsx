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
export const Productinfo = () => {
   const navigate = useNavigate()
  const {loading,setloading} = useContext(Apicontext)
  
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

  const addcart = (products)=>{
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
   


  return (
    <Transition>
      {loading && <Loader/>}
    <div className="product-info-container">
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
        <p className="price">₹ {product.price}</p>
        <button onClick={()=>addcart(product)} className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
    </Transition>
  )
}
