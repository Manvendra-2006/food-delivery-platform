import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute(){
    const{isAuth,user,Loading} = useContext(AppContext)
        const location = useLocation() // current route ki information leta hain

    if(Loading) return null

    if(!isAuth){
        return <Navigate to={"/login"} replace/>
    }
    if(!user?.role  && location.pathname !== "/select-role"){
        return <Navigate to={'/select-role'} replace/>
    }

    if(user?.role && location.pathname === "/select-role"){
        return <Navigate to={'/'} replace/>
    }

    return <Outlet/>
}

