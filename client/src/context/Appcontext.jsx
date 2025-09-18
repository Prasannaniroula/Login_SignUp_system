import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const appContent = createContext()

export const AppContextProvider = (props)=>{
     
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(null)

    const getAuthState = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
            else{
                setIsLoggedin(false);
                setUserData(null);
            }
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Not logged in (normal case) → don't show toast
                setIsLoggedin(false);
                setUserData(null);
              } else {
                // Unexpected error → show toast
                toast.error(error.message || "Something went wrong");
              }
            
        }
    }


    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
            
        } catch (error) {
            toast.error(error.message)
        } 
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData,
    }

    return (
        <appContent.Provider value={value}>
            {props.children}
        </appContent.Provider>
    )
} 
