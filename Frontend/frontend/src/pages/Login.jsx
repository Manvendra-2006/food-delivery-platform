import React, { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../main'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import {FcGoogle} from 'react-icons/fc'
import { AppContext } from '../context/AppContext'

const Login = () => {
    const [loading,setloading] = useState(false)
    const navigate = useNavigate()
    const {setisAuth,setuser} = useContext(AppContext)
    const responseGoogle = async(authResult)=>{
        setloading(true)
        try{
        const result = await axios.post("http://localhost:1000/api/auth/login",{
                code: authResult.code
            })
            const loggedUser = result.data.user || {}
            localStorage.setItem("token",result.data.token)
            setuser(loggedUser)
            setisAuth(true)
            toast.success(result.data.message)    
            if (!loggedUser.role) {
                navigate("/select-role", { replace: true })
            } else if (loggedUser.role.toLowerCase() === "seller") {
                navigate("/restaurant", { replace: true })
            } else {
                navigate("/", { replace: true })
            }
        }
        catch(error){
            console.log(error)
            toast.error("Problem while login")
        }
        finally {
            setloading(false)
        }
    }
    const googleLogin = useGoogleLogin({
        onSuccess:responseGoogle,
        onError:responseGoogle,
        flow:"auth-code"
    })
  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-4'>
        <div className='w-full max-w-sm space-y-6'>
            <h1 className='text-center text-3xl font-bold text-[#E23774]'>
                Tomato
            </h1>
            <p className='text-center text-sm text-gray-500'>Login in or sign up to continue </p>
            <button onClick={googleLogin} disabled={loading} className='flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3'>
                <FcGoogle size={20}/>
                {loading ? "Signing in....":"Continue with google"}
            </button>
            <p className='text-center text-xs text-gray-400'>
                By continuning , you agree with our <span className='text-[#E23774]'>Term of services</span> & 
                <span className='text-[#E23774]'>Privae Policy</span>
            </p>
            
        </div>
    </div>
  )
}

export default Login