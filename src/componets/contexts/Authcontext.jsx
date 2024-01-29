import { createContext, useState } from "react";

export const Authcontext = createContext();

export const Authprovide = ({ children }) => {

  const checkuser = () => {
    const user = localStorage.getItem("user");
    
    return user !== null;
  };
    

  const checkadmin = () => {
    const admin = JSON.parse(localStorage.getItem('user'));
  
    if (admin === 'ameencrews@gmail.com') {
      console.log(admin,"what value");
      return true;
    }
    return false;
  };

  const [authuser, setAuthuser] = useState(checkuser());
  const [authadmin, setAuthadmin] = useState(checkadmin());

  return (
    <Authcontext.Provider value={{ authadmin, authuser, setAuthadmin, setAuthuser }}>
      {children}
    </Authcontext.Provider>
  );
};
