import { BrowserRouter,Routes,Route } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/login"
import {Toaster} from 'react-hot-toast'
import { useEffect } from "react"
import { ProtectedRoute } from "./components/protectedRoute"
import PublicRoute from "./components/publicRoute"
import SelectRole from "./pages/SelectRole"
function App() {
  // useEffect(()=>{
  //   localStorage.clear()
  // },[])
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute/>}>
       <Route path="/login" element={<Login/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route path="/" element={<Home/>}/>   
        <Route path="select-role" element={<SelectRole/>}/>    
        </Route>
      </Routes>
      <Toaster/>
      </BrowserRouter>
    </>
  )
}
export default App
