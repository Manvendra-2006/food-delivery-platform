import Address from "../models/address.model.js"

export async function addAddress(req,resp){
    try{
        const userId = req.user.userData._id
        if (!userId) {
            return resp.status(400).json({ message: "UserId is required or  user is unauthorized" })
        }
        const {formattedAddress , phoneNo, latitude,longitude} = req.body
        if(!formattedAddress||!phoneNo||!latitude||!longitude){
         return resp.status(400).json({ message: "Restaurnat Id and Menu Id are required" })
        }
        const address = await Address.create({
                userId,
                phoneNo,
                location:{
                    type:"Point",
                    coordinates:[Number(longitude),Number(latitude)]
                },
                formattedAddress
        })
        if(!address){
            return resp.status(400).json({message:"Address is not created"})
        }
        return resp.status(201).json({message:"New Address is created successfully",address})
    }
    catch(error){
     return resp.status(500).json({ message: "Internal Server Error", error: error.message })

    }
}

export async function DeleteAddress(req,resp){
    try{
        const userId = req.user.userData._id
        if (!userId) {
            return resp.status(400).json({ message: "UserId is required or  user is unauthorized" })
        }
        const{addressId} = req.params
        if(!addressId){
            return resp.status(400).json({message:"Address Id is required"})
        }
        const deletedAddress = await Address.findOneAndDelete({_id:addressId,userId})
        if(!deletedAddress){
        return resp.status(400).json({message:"Address is not deleted"})
        }
        return resp.status(200).json({message:"Address is deleted successfully",deletedAddress})
    }
    catch(error){
     return resp.status(500).json({ message: "Internal Server Error", error: error.message })

    }
}

export async function FetchAddress(req,resp){
    try{
          const userId = req.user.userData._id
        if (!userId) {
            return resp.status(400).json({ message: "UserId is required or  user is unauthorized" })
        }
        const fetchAddress = await Address.find({userId:userId}) 
        if(!fetchAddress){
                    return resp.status(400).json({message:"Address is not fetched"})

        }
                return resp.status(200).json({message:"Address is fetched successfully",fetchAddress})
 
    }
     catch(error){
     return resp.status(500).json({ message: "Internal Server Error", error: error.message })

    }
}