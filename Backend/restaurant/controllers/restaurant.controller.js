import getBuffer from "../config/datauri.js"
import Restaurant from "../models/restaurant.model.js"
import axios from 'axios'
export async function AddRestaurant(req,resp){
    try{
        const user  = req.user
        if(!user || user.role !== 'Seller'){
            return resp.status(403).json({message:"User is unauthorized or not role have seller"})
        }
        const existingRestaurant = await Restaurant.findOne({
            ownerId:user._id
        })

        if(existingRestaurant){
            return resp.status(400).json({message:"You already have one restaurant with this account"})
        }

        const {name,description,image,phone,latitude,longitude,formattedAddress} = req.body
        if(!name||!description||!image||!latitude||!longitude||!formattedAddress||!phone){
            return resp.status(400).json({message:"All Filelds are required"})
        }
        const file = req.file
        if(!file){
            return resp.status(400).json({message:"Please give file"})
        }
        const fileBuffer = getBuffer(file)
        if(!fileBuffer){
            return resp.status(500).json({message:"Failed to create file buffer"})
        }
        const {data} = await axios.post(`${process.env.UTILI_SERVICE}/api/upload`,{
            buffer: fileBuffer.content
        })
        const restaurant = await User.create({
            name,
            description,
            image:data.url,
            ownerId:req.user._id,
            phone,
            addLocation:{
                type:"Point",
                coordinates:[Number(longitude),Number(latitude)],
                formattedAddress,
            }
        })
        return resp.status(201).json({message:"Restaurant created successfully",restaurant})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}