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
     
    const [cart,setcart]= useState([])
    const [subtotal,setsubtotal] = useState(0)
    const [quantity,setquantity] = useState(0)
    
    async function fetchCart(){
        if(!user||user.role !== "Customer") return ;
        try{
            const {data} = await axios.get("http://localhost:2000/api/restaurant/ALLcart",{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setcart(data.AllCart || [])
            setsubtotal(data.subtotal || 0)
            setquantity(data.cartLength || 0)
        }
        catch(error){
            console.log(error)
        }
    }

    async function addToCart(restaurantId, menuId, quantity_value, name) {
        try {
            const {data} = await axios.post(
                `http://localhost:2000/api/restaurant/create-cart/${restaurantId}/${menuId}`,
                {
                    quantity: quantity_value,
                    name: name
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            // Refresh cart after adding
            await fetchCart()
            return { success: true, data }
        } catch(error) {
            console.log(error)
            return { success: false, error }
        }
    }

    async function updateCartQuantity(menuId, cartId, newQuantity) {
        try {
            const {data} = await axios.patch(
                `http://localhost:2000/api/restaurant/${menuId}/${cartId}`,
                {
                    quantity: newQuantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            // Refresh cart after updating
            await fetchCart()
            return { success: true, data }
        } catch(error) {
            console.log(error)
            return { success: false, error }
        }
    }

    async function deleteCartItem(cartId) {
        try {
            const {data} = await axios.delete(
                `http://localhost:2000/api/restaurant/${cartId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
            // Refresh cart after deleting
            await fetchCart()
            return { success: true, data }
        } catch(error) {
            console.log(error)
            return { success: false, error }
        }
    }

    async function clearCart() {
        try {
            // Delete all cart items
            if (cart && cart.length > 0) {
                for (let item of cart) {
                    await axios.delete(
                        `http://localhost:2000/api/restaurant/${item._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    )
                }
            }
            // Refresh cart after clearing
            await fetchCart()
            return { success: true }
        } catch(error) {
            console.log(error)
            return { success: false, error }
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
    useEffect(()=>{
        if(user && user.role=="Customer"){
            fetchCart()
        }
       
    },[user])
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
    return <AppContext.Provider value={{ Location,isAuth, Loading, setuser, user, setLoading, setisAuth,setLocation,setLoadingLocation,LoadingLocation,city,setcity,cart,subtotal,quantity,fetchCart,addToCart,updateCartQuantity,deleteCartItem,setcart,setsubtotal,setquantity,clearCart }}>{children}</AppContext.Provider>
}