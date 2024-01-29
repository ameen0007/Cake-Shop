
import React, { useContext } from 'react'
import { Authcontext } from './Authcontext'
import { Navigate, Outlet } from 'react-router-dom'

export const Protectedpages = () => {
    const {authuser} = useContext(Authcontext)
     if (!authuser){
        return <Navigate to={'/login'}/>
     }
     return <Outlet/>
    }

 export const Protectedloginpage= () => {
        const {authuser} = useContext(Authcontext)
         if (authuser){
            return <Navigate to={'/'}/>
         }
         return <Outlet/>
        }

        export const Protectedadminpage= () => {
            const {authadmin} = useContext(Authcontext)
             if (!authadmin){
                return <Navigate to={'/'}/>
             }
             return <Outlet/>
            }