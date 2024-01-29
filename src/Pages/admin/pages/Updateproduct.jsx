import React, { useContext, useEffect, useState } from 'react'
import './addproduct.scss'
import { Apicontext } from '../../../componets/Context/Context'
import { Loader } from '../../../componets/Loader/Loader'
export const Updateproduct = () => {
  useEffect(() => {
    // Fetch data and set the 'product' state
    getproductdata();
    return ()=>  setproducts((prevProducts) => ({
      ...prevProducts,
      title: "",
      price: "",
      imageUrl: "",
      category: "",
      description: "",
    }));
  }, []);
  const {products,product,setproducts,getproductdata,editproduct,updateproduct,delelteproduct,loading} = useContext(Apicontext)
    
    
console.log(products,"product");
    

  return (
    <div className="add-product-container">
    {loading &&
     <Loader/>
}
<h2>Update Product</h2>
<form >
<label>
 Product Title:
 <input
   type="text"
   name="title"
   value={products.title}
   onChange={(e)=>setproducts({...products,title : e.target.value})}
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
   onChange={(e)=>setproducts({...products,category : e.target.value})}
   required
 />
</label>

<label>
 Product Description:
 <textarea
   name="description"
   value={products.description}
   onChange={(e)=>setproducts({...products,description : e.target.value})}
   required
 />
</label>

<button onClick={updateproduct} >Update Products</button>
</form>
</div>
  )
}
