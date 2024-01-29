
import React, { useContext, useEffect } from 'react'
import './producttab.scss'
import { Apicontext } from '../../componets/Context/Context'
import { Link } from 'react-router-dom'
import Rating from 'react-rating-stars-component';



export const Producttab = () => {
  const {product,getproductdata,editproduct,updateproduct,delelteproduct} = useContext(Apicontext)


   useEffect(() => {
    getproductdata()
   }, [])
   


  
  console.log(product,"ourproducts");
   console.log(product,"products");



    
  return (
    <>
    <h2>Products Details</h2>
    
    {product.map((data, index) => (
          <div key={index} className="product-item">
            <p>S.No: {index + 1}</p>
            <div>
              <img src={data.imageUrl} alt="Product" />
            </div>
            <p>Title: {data.title}</p>
            <p>Price: {data.price}</p>
            <p>Category: {data.category}</p>
            <p>Date: {data.date}</p>
           
         <Rating
            count={5}
            value={parseFloat(data.rating)}  // Convert the rating to a number
            size={24}
            edit={false}
            isHalf={true}
            activeColor="#ffd700"
          />
            <div className="action-buttons">
            <Link to={'/Updateproduct'}>
            <button onClick={()=> editproduct(data)} >Edit</button>

            </Link>
            
              <button onClick={()=> delelteproduct(data)} >Delete</button>
            </div>
          </div>
        ))}
   
   
   </>
  )
  
}
