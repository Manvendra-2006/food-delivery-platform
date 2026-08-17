import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute(){
    const{isAuth,user,Loading} = useContext(AppContext)
    const location = useLocation()
    const userRole = user?.role?.toString().trim()

    if(Loading) return null

    if(!isAuth){
        return <Navigate to={"/login"} replace/>
    }

    if(userRole && location.pathname === "/select-role"){
        return <Navigate to={'/'} replace/>
    }

    if(!userRole && location.pathname !== "/select-role"){
        return <Navigate to={'/select-role'} replace/>
    }

    return <Outlet/>
}

