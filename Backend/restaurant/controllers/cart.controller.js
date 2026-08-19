import Cart from "../models/cart.model.js"
export async function AddToCart(req,resp){
    try{
        const userId = req.user.userData._id
        if(!userId){
            return resp.status(400).json({message:"UserId is required or  user is unauthorized"})
        }
        const {restaurantId,menuId} = req.params
        if(!restaurantId || !menuId){
            return resp.status(400).json({message:"Restaurnat Id and Menu Id are required"})
        }
        const {quantity,name} = req.body
        if(!quantity || !name){
            return resp.status(400).json({message:"All fields are required"})
        }
        const existingCart = await Cart.findOne({
            userId,
            menuId,
            restaurantId
        })
        if(existingCart){
            existingCart.quantity += quantity
            await existingCart.save()
            return resp.status(200).json({message:"Cart updated Successfully",existingCart})
        }
        else{
 const cart = await Cart.create({
            userId,
            restaurantId,
            menuId,
            quantity,
            name
        })
        if(!cart){
            return resp.status(400).json({message:"Cart is not  created successfully"})
        }
        return resp.status(201).json({message:"Cart is created successfully",cart})
        }
       
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function DeleteCart(req,resp){
    try{
        const {cartId} = req.params        
        if(!cartId){
            return resp.status(400).json({message:"CartId is required"})
        }
        const userId = req.user.userData._id
        if(!userId){
            return resp.status(404).json({message:"User id is required"})
        }
        const deleteCart = await Cart.findOneAndDelete({
            userId:userId,
            _id:cartId
        })
        if(!deleteCart){

            return resp.status(400).json({message:"Cart is not deleted Successfully"})
        }
        return resp.status(200).json({message:"Cart is deleted successfully"})
    }
    catch(error){
    return resp.status(500).json({message:"Internal Server Error",error:error.message})

    }
}
// IT is for getting one cart details
export async function GetCart(req,resp){
    try{
        const {cartId} = req.params
        if(!cartId){
            return resp.status(404).json({message:"CartId is required"})
        }
        const userId = req.user.userData._id
        if(!userId){
            return resp.status(404).json({message:"User id is required"})
        }
        const cartData = await Cart.findOne({_id:cartId,userId:userId})
        if(!cartData){
            return resp.status(404).json({message:"Cart is not found"})
        }
        return resp.status(200).json({message:"Cart Data is fetched",cartData})
    }
    catch(error){
    return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export async function GetAllCart(req,resp){
    try{
    const userId = req.user.userData._id
        if(!userId){
            return resp.status(404).json({message:"User id is required"})
        }
        const AllCart = await Cart.find({userId})
        return resp.status(200).json({message:"All Cart Data Fetch Successfully",AllCart})
    }
    catch(error){
    return resp.status(500).json({message:"Internal Server Error",error:error.message})

    }
}

export async function UpdateCart(req,resp){
    try{
       const userId = req.user.userData._id       
        const {menuId , cartId} = req.params
        if(!userId||!menuId ||!cartId){
            return resp.status(404).json({message:"UserId and MenuId are required"})
        }
        const {quantity} = req.body
        if (quantity === undefined) {
    return resp.status(400).json({
        message: "Quantity is required"
    });
}
        const cartUpdated = await Cart.findOneAndUpdate({_id:cartId,userId:userId,menuId:menuId},{quantity:quantity},{new:true,runValidators: true})
        if(!cartUpdated){
            return resp.status(404).json({message:"Cart is not updated successfully"})
        }
        return resp.status(200).json({message:"Cart Updated Successfully",cartUpdated})
    }
    catch(error){
         return resp.status(500).json({message:"Internal Server Error",error:error.message})
    }
}