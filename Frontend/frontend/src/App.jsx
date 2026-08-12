import { BrowserRouter,Routes,Route } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/login"
import {Toaster} from 'react-hot-toast'
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      <Toaster/>
      </BrowserRouter>
    </>
  )
}
export default App
