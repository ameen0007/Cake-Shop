import React, { useContext, useEffect } from 'react'
import { Dashboard } from './Dashboard'
import { Dashboardtab } from './Dashboardtab'
import { Apicontext } from '../../componets/Context/Context'
import { Header } from '../../componets/header/Header'
import { auth } from '../../firebase/Firebase.config'
import { useNavigate } from 'react-router-dom'

export const Admin = () => {
  const {product,getproductdata} = useContext(Apicontext)
  const navigate = useNavigate()
  useEffect(() => {
    getproductdata()
    const useremail = auth.currentUser.email
    console.log(useremail,"email");
    if (useremail!== 'ameencrews@gmail.com'){
      navigate('/')
    }
   }, [])
  return (
    <>
    
    <Dashboard/>
    </>
    
  )
}
