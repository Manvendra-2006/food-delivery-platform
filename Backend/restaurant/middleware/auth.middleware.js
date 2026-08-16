import User from "../../auth/model/user.model.js"
export async function AuthMiddleware(req,resp,next){
        try{
            const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token
            if(!token){
                return resp.status(400).json({message:"Token Required"})
            }
            const decoded = jwt.verify(token,process.env.JWT_TOKEN)
            const user = await User.findOne({_id:decoded.user._id})
            if(!user){
                return resp.status(401).json({message:"User is unauthorized"})
            }
            req.user = user
            next()

        }
        catch(error){
            return resp.status(500).json({message:"Internal Server Error",error:error.message})
        }
}