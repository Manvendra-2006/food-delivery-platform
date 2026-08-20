import mongoose from "mongoose";
const orderSchema = mongoose.Schema({
    status: {
        type: String,
        enum: ["placed", "accepted","preparing","ready_for_rider","rider_assigned","picked_up","delivered","cancelled"],
    },
    userId: { // complete 
        type: String,
        required: true
    },
    distance:{
        type:Number
    },
    riderAmount:{
        type:Number,
        required:true
    },
    addressId:{ // complete
        type:String,
        required:true
    },
    DeliveryAddress: {  // complete
        formattedAddress:String,
        mobile:Number,
        latitude:Number,
        longitude:Number
    },
    restaurantName: { // complete 
        type: String,
        required: true
    },
    restaurantId: { // complete 
        type: String,
        required: true
    },
    riderId: {
        type: String,
        default:null
    },
    riderPhone: {
        type: Number,
        default:null
    },
    riderName: {
        type: String,
        default:null
    },
    items: [{ //complete
        itemId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        itemName: {
            type: String,
            required: true
        }
    }],
    subTotal: { // complete
        type: Number,
        required: true
    },
    deliveryFees: { // complete
        type: Number,
    },
    platformFee: {// complete
        type: Number
    },
    totalAmount: {// complete
        type: Number
    },
    paymentMethod:{
        type:String,
        enum:["razorpay","stripe"],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid","failed"],
        default:"pending"
    },
    expiresAt:{
        type:Date,
        index:{expireAfterSeconds:0}
    }
},{
    timestamps:true
})

export default mongoose.model("Order",orderSchema)