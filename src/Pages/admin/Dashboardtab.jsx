// Dashboardtab.js
import React, { useContext } from 'react';
import './dashboardtab.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Producttab } from './Producttab';
import { Orderstab } from './Orderstab';
import { useNavigate } from 'react-router-dom';
import { Apicontext } from '../../componets/Context/Context';
import { Loader } from '../../componets/Loader/Loader';
import { UsersTab } from './usertab/UsersTab';

export const Dashboardtab = () => {
  const { mode,loading,setproducts, setMode, changemode ,nickname,setnickname} = useContext(Apicontext);
 const naviagte = useNavigate()

 const Handleaddproduct =()=>{
    naviagte('/addproduct')
 }
 
  return (
    <div className="dashboard-container">
      <div className="add-product-button">
         
        <button onClick={Handleaddproduct}> 
          🛒 Add Product
        </button>
      </div>

      <Tabs>
        <TabList className='dashboardtabs'>
        
           <Tab>🛍️ Products</Tab>
           <Tab>📦 Orders</Tab>
           <Tab>👥 Users</Tab>
        
       
         
        </TabList>

        <TabPanel>
          <Producttab />
        </TabPanel>
        <TabPanel>
          <Orderstab />
        </TabPanel>
        <TabPanel>
          < UsersTab />
        </TabPanel>
      </Tabs>
    </div>
  );
};
