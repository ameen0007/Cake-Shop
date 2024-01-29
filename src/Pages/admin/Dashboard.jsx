import React from 'react'
import './dashboard.scss'
import { Dashboardtab } from './Dashboardtab'
import { Header } from '../../componets/header/Header'


export const Dashboard = () => {
  
  return (
    <>
    <Header/>
    <div className="admin-dashboard-container">
    <div className="dashboard-item">
      <div className="icon">🛍️</div>
      <div className="info">
        <h3>Total Products</h3>
        <p>10 products</p>
      </div>
    </div>

    <div className="dashboard-item">
      <div className="icon">📦</div>
      <div className="info">
        <h3>Total Orders</h3>
        <p>5 orders</p>
      </div>
    </div>

    <div className="dashboard-item">
      <div className="icon">👥</div>
      <div className="info">
        <h3>Total Users</h3>
        <p>20 users</p>
      </div>
    </div>

    <div className="dashboard-item">
      <div className="icon">📊</div>
      <div className="info">
        <h3>Total Revenue</h3>
        <p>$5000</p>
      </div>
    </div>
  </div>
  <Dashboardtab/>
  </>
  )
}
