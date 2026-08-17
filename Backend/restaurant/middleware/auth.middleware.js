import axios from 'axios'
import jwt from 'jsonwebtoken'
export async function AuthMiddleware(req,resp,next){
        try{
            const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token
            if(!token){
                return resp.status(400).json({message:"Token Required"})
            }
            const decoded = jwt.verify(token,process.env.JWT_TOKEN)
            const userExists = await axios.get(`http://localhost:1000/api/auth/account`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(!userExists){
                return resp.status(401).json({message:"User is unauthorized please login "})
            }
            console.log("Data bhai ka",userExists.data)
            req.user = userExists.data
            console.log(userExists.data)
            next()

        }
        catch(error){
            return resp.status(500).json({message:"Internal Server Error",error:error.message})
        }
}