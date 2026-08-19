import mongoose from "mongoose";
const cartSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true,
        index:true
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true,
        index:true
    },
    menuId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dish",
        required:true,
        index:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1,
        min:1
    },
    name:{
        type:String,
        required:true
    },

},{
    timestamps:true
})
export default mongoose.model("Cart",cartSchema)