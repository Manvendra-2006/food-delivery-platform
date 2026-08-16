import express from 'express'
import cloudinary from 'cloudinary'
import router from './routes/cloudinary'
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const {CLOUD_NAME,CLOUD_API_KEY,CLOUD_SECRET_KEY} = process.env
if(!CLOUD_NAME||!CLOUD_API_KEY||!CLOUD_SECRET_KEY){
    throw new Error("All Cloudinary filds are required")
}
cloudinary.v2.config({
    cloud_name:CLOUD_NAME,
    api_key:CLOUD_API_KEY,
    api_secret:CLOUD_SECRET_KEY
})

app.use("/api",router)
export default app