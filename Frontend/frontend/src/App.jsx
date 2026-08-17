import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/login"
import {Toaster} from 'react-hot-toast'
import { ProtectedRoute } from "./components/protectedRoute"
import PublicRoute from "./components/publicRoute"
import SelectRole from "./pages/SelectRole"
import Navbar from "./components/Navbar"
import Account from "./pages/Account"
import Cart from "./pages/Cart"
import { useContext } from "react"
import Restaurant from "./pages/Restaurant"
import { AppContext } from "./context/AppContext"
import Menu from "./pages/Menu"
import AddDish from "./pages/AddDish"
import EditDish from "./pages/EditDish"
function SellerRouteGuard() {
  const { user } = useContext(AppContext)
  const location = useLocation()
  const userRole = user?.role?.toString().trim().toLowerCase()

  const allowedPaths = ["/restaurant", "/account", "/cart", "/menu", "/menu/add"]
  const pathStartsWith = ["/menu/edit", "/menu/add"]

  if (userRole === "seller") {
    const isAllowed = allowedPaths.includes(location.pathname) || 
    pathStartsWith.some(path => location.pathname.startsWith(path))
    
    if (!isAllowed) {
      return <Navigate to="/restaurant" replace />
    }
  }

  return null
}

function App() {
  return (
    <>
      <BrowserRouter>
      <SellerRouteGuard />
      <Navbar/>
      <Routes>
        <Route element={<PublicRoute/>}>
       <Route path="/login" element={<Login/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route path="/" element={<Home/>}/>   
        <Route path="select-role" element={<SelectRole/>}/>    
        <Route path="/account" element={<Account/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/restaurant" element={<Restaurant/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/menu/add" element={<AddDish />} />
<Route path="/menu/edit/:id" element={<EditDish />} />
        </Route>
      </Routes>
      <Toaster/>
      </BrowserRouter>
    </>
  )
}
export default App
