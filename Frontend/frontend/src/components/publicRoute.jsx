import { Navigate,Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
function PublicRoute(){
    const {isAuth,Loading} = useContext(AppContext)
    if(Loading) return null
    return isAuth ? <Navigate to="/" replace/>:<Outlet/>
}

export default PublicRoute