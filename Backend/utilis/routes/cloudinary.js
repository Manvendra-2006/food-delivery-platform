import express from 'express'
import cloudinary from 'cloudinary'
const router = express.Router()

router.post("/upload",async (req,resp)=>{
    try{
        const {buffer} = req.body
        const cloud = await cloudinary.v2.uploader.upload(buffer)
        resp.json({
            url:cloud.secure_url
        })
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
})

export default router