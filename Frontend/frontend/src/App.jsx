import { BrowserRouter,Routes,Route } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/login"
import {Toaster} from 'react-hot-toast'
import { useEffect } from "react"
import { ProtectedRoute } from "./components/protectedRoute"
import PublicRoute from "./components/publicRoute"
import SelectRole from "./pages/SelectRole"
import Navbar from "./components/Navbar"
import Account from "./pages/Account"
import Cart from "./pages/Cart"
function App() {
  // useEffect(()=>{
  //   localStorage.clear()
  // },[])
  return (
    <>
      <BrowserRouter>
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
        </Route>
      </Routes>
      <Toaster/>
      </BrowserRouter>
    </>
  )
}
export default App
