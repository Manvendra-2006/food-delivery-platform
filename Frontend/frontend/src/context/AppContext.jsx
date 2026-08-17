import { useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
export const AppContext = createContext()
import axios from 'axios'
export function AppProvider({ children }) {
    const [user, setuser] = useState(null)
    const [isAuth, setisAuth] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [Location, setLocation] = useState(null)
    const [LoadingLocation, setLoadingLocation] = useState(false)
    const [city, setcity] = useState("Fetching Location.....")

    async function fetchUser() {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            if (!token) {
                setuser(null)
                setisAuth(false)
                return
            }

            const {data} = await axios.get("http://localhost:1000/api/auth/account",{
                 headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setuser(data.userData)
            setisAuth(true)
        }
        catch (error) {
            console.log(error)
            setuser(null)
            setisAuth(false)
            localStorage.removeItem("token")
        }
        finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        fetchUser()
    }, [])
    useEffect(() => {

        if (!navigator.geolocation) return alert("Please allow location to continue")
        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                console.log(response)
                const data = await response.json()
                setLocation(
                    {
                        latitude,
                        longitude,
                        formattedAddress: data.display_name || "Current Location"
                    }
                )
                setcity(
                    data.address.city || data.address.town || data.address.village || "Your Location"
                )
            }
            catch (error) {
                setLocation(
                    {
                        latitude,
                        longitude,
                        formattedAddress: "Current Location"
                    }
                )
                setcity("Failed to Load")
                console.log(error)
            }
        })
    },[])
    return <AppContext.Provider value={{ Location,isAuth, Loading, setuser, user, setLoading, setisAuth,setLocation,setLoadingLocation,LoadingLocation,city,setcity }}>{children}</AppContext.Provider>
}