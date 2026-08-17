// models/dish.model.js
import mongoose from 'mongoose'

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Starters", "Mains", "Classics", "Desserts"],
        required: true
    },
    tags: {
        type: [String],
        enum: ["Gluten-Free", "Vegan", "Organic", "Chef Special"],
        default: []
    },
    restaurantId: {           
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    ownerId: {                 
        type:String,
        required:true
    },
    isAvailable: {             
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model("Dish", dishSchema)