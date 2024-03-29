import React, { useContext, useEffect, useState } from 'react'
import './home.scss'
import { Header } from '../../componets/header/Header'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import { Apicontext } from '../../componets/Context/Context'
import classNames from 'classnames'
import { Filter } from '../../componets/Filter/Filter'

import { Footer } from '../../componets/Footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { addtocart, deletefromcart } from '../../Redux/cartSlice'
import { Transition } from '../../componets/Animation/Transition'
import { ProductCard } from '../../componets/productcard/ProductCard'








export const Home  = () =>{
    
  const {mode} = useContext(Apicontext)
  const dispatch = useDispatch()
  const cartitem = useSelector((state)=> state.cart)

  const [text] = useTypewriter({
    words : ['Chocolate','Vanilla','Strawberry','Butterscotch','Red Velvet','Black Forest','White Forest','Mango','Blueberry','Oreo'],
    loop:{},
  })
  
  const addcart =()=>{
    dispatch(addtocart("oreo cake"))
    console.log(cartitem);
  }
  const deletecart =()=>{
    dispatch(deletefromcart("oreo cake"))
    console.log(cartitem);
  }
    
  const darkmode = classNames("main-div",{"mode":!mode})
  

  return (
    
  
    <Transition>
      <>
        <Header/>
       
        <div className={darkmode}>
           <div className='img-div'>
            <img src="cupcake.png" alt="" loading="lazy" />
           </div>
           
           <div className='typebox'>
            <h2>We Have <span>{text}</span><Cursor/> Cake</h2>
            
        </div>
           <div className='slogan'>
              <span className='first '>"Every Person Is <small>Unique <br /></small></span>
              
              <span className='second '>Why Shouldn`t Their <small>Cake</small> Be ?"</span>
           </div>
          
        </div>
        
      <ProductCard/>
        <Footer/>
        </>
        </Transition>
  )
  }

