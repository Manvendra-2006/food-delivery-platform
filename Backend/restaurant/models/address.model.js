import mongoose from "mongoose";
const addressModel = mongoose.Schema({
    phoneNo:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    formattedAdress:{
        type:String,
        required:true
    },
   location: {
    type: {
        type: String,
        enum: ["Point"],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
    
}
},{
    timestamps:true
})
addressModel.index({location:"2dsphere"})
export default mongoose.model("Address",addressModel)