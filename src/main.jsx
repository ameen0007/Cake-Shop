import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Modeprovider } from './componets/Context/Context.jsx'
import { Provider } from 'react-redux'
import { store } from './Redux/store.jsx'
import { Authprovide } from './componets/contexts/Authcontext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
    <Authprovide>
    <Provider store={store}>
   <Modeprovider>
    

  
    <App />
    
   
    </Modeprovider>
    </Provider>
    </Authprovide>
    </BrowserRouter>
 
)
