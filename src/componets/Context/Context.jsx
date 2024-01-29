import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fireDB } from "../../firebase/Firebase.config";
import { useNavigate } from "react-router-dom";


export const Apicontext = createContext();

export const Modeprovider = ({ children }) => {
  const navigate = useNavigate()
  const [mode, setMode] = useState(true);
  const [loading , setloading] = useState(false)

  //nickkname state context api
   const [nickname ,setnickname] = useState("")
   const [showpassword,setshowpassword] = useState(false)
 
  const changemode =()=>{
    setMode(!mode)
  }
  
  const handlechangebutton = () => {
    
    setshowpassword(!showpassword);
  };

  const [products,setproducts] = useState({
      title : "",
      price : "",
      imageUrl : "",
      category : "",
      description : "",
      time : Timestamp.now(),
      date : new Date().toLocaleString(
        "en-US",

        {
          month : "short",
          day : '2-digit',
          year : 'numeric',
        }


      )
  })

  const addProductitems = async (e)=>{
    e.preventDefault();
   

    if (
      products.title === "" ||
      products.price === "" ||
      products.discountprice === "" ||
      (isNaN(products.rating) || products.rating < 0.5 || products.rating > 5.0) ||
      products.imageUrl === "" ||
      products.category === "" ||
      products.description === ""
    ) {
      console.log(products, "products");
      setloading(false);
      toast.error("All fields are required, and rating should be between 0 and 5");
      return;
    }
      setloading(true)
      try {
        
        const productref = collection(fireDB,'productsitem')
        await addDoc(productref,products)
        getproductdata()
        toast.success("Added product successfully...!")
        setloading(false)
        setproducts((prevProducts) => ({
          ...prevProducts,
          title: "",
          price: "",
          imageUrl: "",
          category: "",
          description: "",
        }));
        setTimeout(() => {
          navigate('/Admin')
        },800);
       
      } catch (error) {
        console.log(error);
        toast.error("Error adding product. Please try again later.");
        setloading(false)
      }
  }

   const [product,setproduct] = useState([])

   const getproductdata = async ()=>{
    
      try {
        const q = query(
          collection(fireDB , 'productsitem'),
          orderBy('time')
        )

        const data = onSnapshot (q,(Querysnapshot) => {
          let produtcarray = []
          Querysnapshot.forEach((doc)=>{
            produtcarray.push({...doc.data(),id : doc.id})
          })
          setproduct(produtcarray)
         
          
        
        })
        
        return ()=> data
         
      } catch (error) {
        setloading(false)
      }
   }


   const editproduct= (data)=>{
    setproducts(data);
   }

   const updateproduct = async (e)=>{
    e.preventDefault();
    setloading(true)
      try {
    
        await setDoc(doc(fireDB,"productsitem",products.id),products)
        toast.success('Product Update Succesfully ')
        setproducts((prevProducts) => ({
          ...prevProducts,
          title: "",
          price: "",
          imageUrl: "",
          category: "",
          description: "",
        }));
         getproductdata()
         setTimeout(() => {
          navigate('/Admin')
        },800);
         
        setloading(false)
      } catch (error) {
        console.log(error);
        setloading(false)
      }
   }

   const delelteproduct = async (item)=>{
    console.log(item.id,"item id");
    setloading(true)
     try {
       
      await deleteDoc(doc(fireDB,'productsitem',item.id))
      console.log(item);
      console.log(item.id,"item id");
      toast.success('product deleted successfully')
      getproductdata()
      setloading(false)

     } catch (error) {
       console.log(error);
       setloading(false)
     }
   }



  
   useEffect(() => {
     getproductdata()

   }, [])
   

   const [order, setOrder] = useState([]);

   const getOrderData = async () => {
    setloading(true);
    try {
      const result = await getDocs(collection(fireDB, "order"));
      const ordersArray = [];
  
      result.forEach((doc) => {
        // Include the id when constructing the order object
        ordersArray.push({ id: doc.id, ...doc.data() });
      });
  
      setOrder(ordersArray);
      console.log(ordersArray);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  
  useEffect(() => {
    getproductdata()
    getOrderData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setloading(true);
    try {
      const orderRef = doc(fireDB, "order", orderId);
      await setDoc(orderRef, { addressinfo: { orderstatus: newStatus } }, { merge: true });
      toast.success("Order status updated successfully");
      getOrderData(); // Refresh order data after updating
      setloading(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status. Please try again later.");
      setloading(false);
    }
  };

 const [user,setuser]=useState([])
const getuserdata = async ()=>{
  setloading(true)
  try {
     
    const result = await getDocs(collection(fireDB,'users'))
    const usersArray = []
    result.forEach((doc)=> {
      usersArray.push(doc.data())
      setloading(false)
    })
    setuser(usersArray)
    console.log(usersArray);
    setloading(false)

  } catch (error) {
    console.log(error);
    setloading(false)
  }
}

useEffect(() => {
  getuserdata()
}, [])


const [resultfound,setresultfound]= useState("")
 
 const [searchkey,setsearchkey]= useState("")
 const [filtertype,setfiltertype]= useState("")
 const [filterprice,setfilterprice]= useState("")


  return (
    <Apicontext.Provider value={{ mode, setMode ,changemode,loading,setloading,
    nickname,setnickname,product,setproduct,products,setproducts,
    addProductitems,showpassword,setshowpassword,handlechangebutton,
    getproductdata,editproduct,updateproduct,delelteproduct,
    order,getOrderData, updateOrderStatus,user,searchkey,setsearchkey
    ,filtertype,setfiltertype,filterprice,setfilterprice,setresultfound,resultfound}}>
      {children}
    </Apicontext.Provider>
  );
};
