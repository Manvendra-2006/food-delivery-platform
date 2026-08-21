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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FCEAEA]/40 px-4'>
        <div className='w-full max-w-sm space-y-6 bg-white border border-[#EFE8DD] rounded-2xl shadow-[0_4px_28px_rgba(43,33,27,0.08)] p-8'>
            <div className='flex flex-col items-center gap-1'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E23744]/15 to-[#E23744]/5 flex items-center justify-center mb-1 ring-1 ring-[#E23744]/10'>
                    <span className='font-serif text-2xl font-bold text-[#E23744]'>T</span>
                </div>
                <h1 className='font-serif text-center text-3xl font-bold text-[#E23744]'>
                    Tomato
                </h1>
                <p className='text-center text-sm text-[#8A8078]'>Login in or sign up to continue </p>
            </div>
            <button onClick={googleLogin} disabled={loading} className='flex w-full items-center justify-center gap-3 rounded-xl border border-[#E7DFD3] bg-[#FFFDF9] px-4 py-3 font-medium text-[#2B211B] shadow-sm hover:bg-white hover:border-[#E23744]/30 active:scale-[0.99] disabled:opacity-60 transition-all'>
                <FcGoogle size={20}/>
                {loading ? "Signing in....":"Continue with google"}
            </button>
            <p className='text-center text-xs text-[#B4AA9C]'>
                By continuning , you agree with our <span className='text-[#E23744] font-medium'>Term of services</span> & 
                <span className='text-[#E23744] font-medium'>Privae Policy</span>
            </p>
            
        </div>
    </div>
  )
}

export default Login