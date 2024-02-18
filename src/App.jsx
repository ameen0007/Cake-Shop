import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Home } from "./Pages/Home/Home"
import { Login } from "./Pages/login/Login"
import { Signup } from "./Pages/signup/Signup"
import { Forget } from "./Pages/forget/Forget"
import { AnimatePresence } from "framer-motion"
import { Productinfo } from "./Pages/productinfo/Productinfo"
import { Cart } from "./Pages/cart/Cart"
import { Dashboard } from "./Pages/admin/Dashboard"
import { Addproduct } from "./Pages/admin/pages/Addproduct"
import { Updateproduct } from "./Pages/admin/pages/Updateproduct"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Admin } from "./Pages/admin/Admin"
import { Orders } from "./Pages/admin/pages/Orders/Orders"
import { Protectedadminpage, Protectedloginpage, Protectedpages } from "./componets/contexts/ProtectedRoutes"
import { Allproducts } from "./Pages/Allproducts/Allproducts"



function App() {

const location = useLocation()
  return (
    <>
<AnimatePresence mode="wait" > 
    <Routes key={location.pathname} location={location } >

      <Route  path="/" element={<Home/>}/>
      <Route path="/Products" element={<Allproducts/>}/>

      <Route element={<Protectedloginpage/>}>
      <Route  path="/Login" element={<Login/>}/>
      <Route  path="/Signup" element={<Signup/>}/>
      <Route  path="/Forget" element={<Forget/>}/>
      </Route>

     <Route element={<Protectedpages/>}>
      <Route  path="/cart" element={ <Cart/>}/>
      <Route  path="/orders" element={<Orders/>}/>
      <Route  path="/Productinfo/:id" element={<Productinfo/>}/>
      </Route>

      <Route element={<Protectedadminpage/>}>
      <Route  path="/Dashboard" element={<Dashboard/>}/>
      <Route  path="/Admin" element={<Admin/>}/>
      <Route path="/addproduct" element={<Addproduct />} />
     <Route path="/updateproduct" element={<Updateproduct/>} />
     </Route>
     
    </Routes>
    
    </AnimatePresence>
    <ToastContainer/>
   
    </>
  )
}

export default App

//user protected 
// export const Protectedroute = ({children}) =>{
//   const user = localStorage.getItem('user')
//   if (user){
//     return children
//   }else{
//     return <Navigate to={'/'}/>
//   }
// }
// //admin protected 

// const Protectedadmin =({children})=>{
//   const admin =JSON.parse(localStorage.getItem('user'))
//   if(admin.user.email === 'ameencrews@gmail.com'){
//     return children
//   }else{
//     return <Navigate to={'/'}/>
//   }
// }