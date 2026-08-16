import { oauth2client } from "../config/googleConfig.js"
import User from "../model/user.model.js"
import jwt from "jsonwebtoken"
import axios from "axios"

export async function loginController(req, resp) {
    try {
        const { code } = req.body

        if (!code) {
            return resp.status(400).json({
                message: "Authorization Code is required"
            })
        }

        const googleRes = await oauth2client.getToken(code)

       
        oauth2client.setCredentials(googleRes.tokens)

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )
        // console.log("GOOGLE USER:", userRes.data)
        const { name, email, picture } = userRes.data

        if (!name || !email || !picture) {
            return resp.status(400).json({
                message: "All Fields are required"
            })
        }

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture
            })
        }

        const token = jwt.sign(
            { user},
            process.env.JWT_TOKEN,
            { expiresIn: "7d" }
        )

        resp.cookie("token", token)

        return resp.status(200).json({
            message: "Login Successfully",
            user,
            token
        })

    } catch (error) {
         console.log("GOOGLE LOGIN ERROR:", error)
        return resp.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export async function RoleController(req,resp){
    try{
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token
    const {role} = req.body
    if(!token || !role){
        return resp.status(400).json({message:"Token required"})
    }
    const decoded = jwt.verify(token,process.env.JWT_TOKEN)
    console.log("Id vala thumka lago",decoded.user)
    const user = await User.findByIdAndUpdate(decoded.user._id,{role},{returnDocument:"after",runValidators: true})

    console.log("User pata laga",user)
    if(!user){
        return resp.status(404).json({message:"User not found"})
    }
    const tokenRole = jwt.sign(
        {user},
        process.env.JWT_TOKEN,
        {expiresIn:"7d"}
    )
    resp.cookie("token",tokenRole)
    return resp.status(200).json({message:"Role is updated",tokenRole,user})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function AccountDetails(req,resp){
    try{
        const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token
        if(!token){
            return resp.status(400).json({message:"Role Required"})
        }
        console.log("token mila",token)
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        console.log("data mila",decoded)
        const userData = await User.findOne({_id:decoded.user._id})
       return resp.status(200).json({message:"Data is fetched successfully",userData})
    }
    catch(error){
        return resp.status(500).json({message:"Internaal Server Error",error:error.message})
    }
}