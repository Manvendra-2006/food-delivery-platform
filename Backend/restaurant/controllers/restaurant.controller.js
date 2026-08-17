import getBuffer from "../config/datauri.js"
import Restaurant from "../models/restaurant.model.js"
import axios from 'axios'
import Dish from "../models/menu.model.js"
export async function AddRestaurant(req,resp){
    try{
        const user  = req.user
        if(!user.userData || user.userData.role !== 'Seller'){
            return resp.status(403).json({message:"User is unauthorized or not role have seller"})
        }
        const existingRestaurant = await Restaurant.findOne({
            ownerId:user.userData._id
        })

        if(existingRestaurant){
            return resp.status(400).json({message:"You already have one restaurant with this account"})
        }

        const {name,description,phone,latitude,longitude,formattedAddress} = req.body
        if(!name||!description||!latitude||!longitude||!formattedAddress||!phone){
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
        const restaurant = await Restaurant.create({
            name,
            description,
            image:data.url,
            ownerId:req.user.userData._id,
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

export async function FetchAccount(req,resp){
    try{
        const user = req.user
   if(!user.userData || user.userData.role !== 'Seller'){
            return resp.status(403).json({message:"User is unauthorized or not role have seller"})
        }
        const restaurantData = await Restaurant.findOne({ownerId:user.userData._id})
        if(!restaurantData){
              return resp.status(400).json({message:"No restaurant Data"})
        }
        return resp.status(200).json({message:"Restaurant Data is fetched successfully",restaurantData})
        // yaha par restaurant id banana hain token main yadi zarraot pade toh 
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function UpdateRestaurant(req,resp){
    try{
        const userId = req.user.userData._id      
        console.log(userId)
        if(!userId){
            return resp.status(404).json({message:"User is unauthorized"})
        }
        const {name,description,phone,isOpen} = req.body
        const restaurantData = await Restaurant.findOne({ownerId:userId})
        if(!restaurantData){
            return resp.status(404).json({message:"Restaurant not found"})
        }
        const restaurantUpdate = await Restaurant.findByIdAndUpdate(restaurantData._id,{ name, description, phone, isOpen },{new:true,runValidators:true})
        if(restaurantUpdate){
            return resp.status(200).json({message:"Restaurna Id is updated succcessfully",restaurantUpdate})
        }
    }
    catch(error){
        return resp.status(500).json({message:"Intenral Server Error",error:error.message})
    }
}

export async function AddMenu (req,resp){
    try{
        const userId = req.user.userData._id
        if(!userId){
            return resp.status(400).json({message:"User is unauthorized"})
        }
        const ownerId = userId
        const restaurant = await Restaurant.findOne({ownerId})
        if(!restaurant){
            return resp.status(404).json({message:"No restaurant is exist for this ownerId"})
        }
        const restaurantId = restaurant._id
        const file = req.file
        if(!file){
            return resp.status(404).json({message:"Please give image"})
        }
        const fileBuffer = getBuffer(file)
        if(!fileBuffer){
            return resp.status(404).json({message:"FIle is not buffered"})
        }
          const {data} = await axios.post(`${process.env.UTILI_SERVICE}/api/upload`,{
            buffer: fileBuffer.content
        })
        const {name,description,price,category,tags} = req.body
        if(!name||!description||!price||!category||!tags){
            return resp.status(404).json({message:"All fields are required"})
        }
        const menu = await Dish.create({
            name,
            description,
            price,
            category,
             tags :JSON.parse(req.body.tags),
            ownerId,
            image:data.url,
            restaurantId
        })
        if(!menu){
            return resp.status(404).json({message:"Menu is not created"})
        }
        return resp.status(201).json({message:"Menu is created Successfully",menu})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}


export async function GetMenu(req,resp){
    try{
        const userId = req.user.userData._id
        console.log(userId)
        if(!userId){
            return resp.status(404).json({message:"Unauthorized user"})
        }
        const MenuData = await Dish.find({
            ownerId:userId
        })
        if(!MenuData){
            return resp.status(404).json({message:"No Menu is in database for this restaurant"})
        }
        return resp.status(200).json({message:"Menu data fetched successfully",MenuData})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function SingleDishFetch(req,resp){
    try{
        const userId = req.user.userData._id
        console.log(userId)
        const id = req.params.id
        console.log(id)
        if(!userId){
            return resp.status(404).json({message:"Unauthorized user"})
        }
           const SingleMenuData = await Dish.findById(id)
           if(SingleMenuData){
            return resp.status(200).json({message:"Single Menu fetched successfully",SingleMenuData})
           }
    }
    catch(error){
     return resp.status(500).json({message:"Internal Server Error",error:error.message})

    }
}

export async function DishUpdated(req,resp){
    try{
    const id = req.params.id
    const {name,description,price,category,tags,isAvailable} = req.body
    const menu = await Dish.findByIdAndUpdate(id,{name,description,price,category,tags,isAvailable},{new:true,runValidators:true})
    if(!menu){
        return resp.status(404).json({message:"Dish Data is not updated"})
    }
    return resp.status(200).json({message:"Dish data is updated",})
    }
    catch(error){
     return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function DeleteDish(req,resp){
    try{
const id = req.params.id
    const menu = await Dish.findByIdAndDelete(id)
       if(!menu){
        return resp.status(404).json({message:"Dish Data is not deleted"})
    }
    return resp.status(200).json({message:"Dish data is deleted"})

    }
    catch(error){
             return resp.status(500).json({message:"Internal Server Error",error:error.message})

    }
}