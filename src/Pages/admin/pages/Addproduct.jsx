import React, { useContext, useEffect, useState } from 'react'
import './addproduct.scss'
import { Apicontext } from '../../../componets/Context/Context';
import { IoLogoHackernews } from 'react-icons/io5';
import { Loader } from '../../../componets/Loader/Loader';




export const Addproduct = () => {
  useEffect(() => {
    getproductdata()
   }, [])

  const {mode,getproductdata,loading,setloading,products,setproducts,addProductitems} = useContext(Apicontext)


  // const convertRatingToStars = (rating) => {
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 !== 0;
  //   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  //   const starArray = Array.from({ length: fullStars }, (_, index) => (
  //     <span key={index} className="full-star">★</span>
  //   ));
  
  //   const halfStar = hasHalfStar ? <span key="half-star" className="half-star">★</span> : null;
  
  //   const emptyStarArray = Array.from({ length: emptyStars }, (_, index) => (
  //     <span key={`empty-star-${index}`} className="empty-star">☆</span>
  //   ));
  
  //   return (
  //     <>
  //       {starArray}
  //       {halfStar}
  //       {emptyStarArray}
  //     </>
  //   );
  // };

  return (
    <div className="add-product-container">
             {loading &&
              <Loader/>
         }
      <h2>Add Product</h2>
      <form >
        <label>
          Product Title:
          <input
            type="text"
            name="title"
            value={products.title }
            onChange={(e)=>setproducts({...products,title : e.target.value})}
            required
          />
        </label>
        <label>
          Product Rating:
          <input
            type="text"
            name="rating"
            value={products.rating}
            onChange={(e)=>setproducts({...products,rating : e.target.value})}
            required
          />
        </label>
           
        <label>
          Product Price:
          <input
            type="text"
            name="price"
            value={products.price}
            onChange={(e)=>setproducts({...products, price: e.target.value})}
            required
          />
        </label>
        <label>
          Product Discount Price:
          <input
            type="text"
            name="discountprice"
            value={products.discountprice}
            onChange={(e)=>setproducts({...products, discountprice: e.target.value})}
            required
          />
        </label>

        <label>
          Product Image URL:
          <input
            type="url"
            name="imageUrl"
            value={products.imageUrl}
            onChange={(e)=>setproducts({...products,imageUrl : e.target.value})}
            required
          />
        </label>
   
        <label>
          Product Category:
          <input
            type="text"
            name="category"
            value={products.category}
            onChange={(e)=>setproducts({...products,category : e.target.value.toLowerCase()})}
            required
          />
        </label>

        <label>
          Product Description:
          <input
          type='text'
            name="description"
            value={products.description}
            onChange={(e)=>setproducts({...products,description : e.target.value})}
            required
          />
        </label>
      
        <button onClick={addProductitems} >Add Product</button>
      </form>
    </div>
  )
}
