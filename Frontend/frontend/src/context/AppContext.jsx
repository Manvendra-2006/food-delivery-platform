import { useState } from "react";
import { createContext } from "react";
import api from "../../axios";
import { useEffect } from "react";
export const AppContext = createContext()
export function AppProvider({ children }) {
    const [user, setuser] = useState(null)
    const [isAuth, setisAuth] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [Location, setLocation] = useState(null)
    const [LoadingLocation, setLoadingLocation] = useState(false)
    const [city, setcity] = useState("Fetching Location.....")

    async function fetchUser() {
        try {
            const token = localStorage.getItem("token")
            const { data } = await api.get("/auth/account", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setuser(data.user)
            setisAuth(true)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }

    }
useEffect(()=>{
    fetchUser()
},[])

return <AppContext.Provider value={{isAuth,Loading,setuser,user,setLoading}}>{children}</AppContext.Provider>
}