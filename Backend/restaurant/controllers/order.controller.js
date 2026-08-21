import Address from "../models/address.model.js"
import Cart from "../models/cart.model.js"
import Restaurant from "../models/restaurant.model.js"
import Order from "../models/order.model.js"
export async function createOrder(req, resp) {
    try {
        const { paymentMethod, distance } = req.body
        if (!paymentMethod) {
            return resp.status(404).json({ message: "paymentMethod is required" })
        }
        if (
            distance === undefined ||
            distance === null ||
            typeof distance !== "number" ||
            distance < 0
        ) {
            return resp.status(400).json({
                message: "Valid distance is required"
            })
        }
        const userId = req.userData._id
        if (!userId) {
            return resp.status(404).json({ message: "UserId is required" })
        }
        const { restaurantId, addressId } = req.params
        if (!restaurantId) {
            return resp.status(404).json({ message: "Restaurant Id is required" })
        }
        const restaurantData = await Restaurant.findById(restaurantId)
        if (!restaurantData) {
            return resp.status(400).json({ message: "Restaurant Id is invalid" })
        }
        if (!restaurantData.isOpen) {
            return resp.status(404).json({ message: "Soory this restaurant is closed for now" })
        }
        const restaurantName = restaurantData.name
        const addressOfUser = await Address.findOne({ userId: userId, _id: addressId })
        if (!addressOfUser) {
            return resp.status(400).json({ message: "Address Id is invalid" })
        }
        const formattedAddress = addressOfUser.formattedAddress
        const mobile = addressOfUser.phoneNo
        const [longitude, latitude] = addressOfUser.location.coordinates
        const itemDetail = await Cart.find({ userId: userId, restaurantId: restaurantId }).populate("menuId")
        if (itemDetail.length === 0) {
            return resp.status(404).json({
                message: "Cart is empty for this restaurantId and UserId"
            })
        }
        const items = []
        let subTotal = 0
        for (let item of itemDetail) {
            items.push({
                itemId: item.menuId._id,
                quantity: item.quantity,
                price: item.menuId.price,
                itemName: item.name
            })
            subTotal += item.menuId.price * item.quantity
        }
        const deliveryFees = subTotal < 250 ? 49 : 0
        const platformFee = 7;
        const totalAmount = subTotal + deliveryFees + platformFee
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
        const riderAmount = Math.ceil(distance) * 17
        const order = await Order.create({
            userId,
            paymentMethod,
            totalAmount,
            platformFee,
            deliveryFees,
            subTotal,
            expiresAt,
            items: items,
            restaurantId,
            riderAmount,
            distance,
            addressId,
            restaurantName,
            DeliveryAddress: {
                formattedAddress,
                mobile,
                latitude,
                longitude
            },
            paymentStatus: "pending"
        })
        await Cart.deleteMany({ userId: userId, restaurantId: restaurantId })
        return resp.status(201).json({ success: true, message: "Order is created successfully", orderId: order._id, amount: totalAmount })
    }
    catch (error) {
        return resp.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export async function fetchOrderForPayment(req,resp){
        try{
            if(req.headers['x-internal-key'] !== process.env.INTERNAL_SERVICE_KEY){
                return resp.status(403).json({message:"ForBidded"})
            }
            const order = await Order.findById(req.params.id)
            if(!order){
                return resp.status(404).json({message:"Order not found"})
            }
            if(order.paymentStatus !== "pending"){
                return resp.status(400).json({message:"Order Already paid"})
            }
            return resp.status(200).json({message:"Order is fetched successfully",orderId:order._id,amount:order.totalAmount,currency:"INR"})
        }
        catch(error){
        return resp.status(500).json({ message: "Internal Server Error", error: error.message })
        }
}