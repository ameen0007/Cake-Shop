import React, { useContext, useEffect } from 'react'
import { Dashboard } from './Dashboard'
import { Dashboardtab } from './Dashboardtab'
import { Apicontext } from '../../componets/Context/Context'
import { Header } from '../../componets/header/Header'

export const Admin = () => {
  const {product,getproductdata} = useContext(Apicontext)
  useEffect(() => {
    getproductdata()
   }, [])
  return (
    <>
    
    <Dashboard/>
    </>
    
  )
}
