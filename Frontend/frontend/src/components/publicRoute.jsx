import { Navigate,Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
function PublicRoute(){
    const {isAuth,user,Loading} = useContext(AppContext)
    const userRole = user?.role?.toString().trim()

    if(Loading) return null

    if(isAuth){
        return <Navigate to={userRole ? "/" : "/select-role"} replace/>
    }

    return <Outlet/>
}

export default PublicRoute