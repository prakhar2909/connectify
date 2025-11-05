import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/AuthRoutes.js'
import contactRoutes from './routes/ContactRoutes.js'
import setupSocket  from './socket.js'
import messageRoutes from './routes/MessageRoutes.js'
dotenv.config()


const app = express()
const port=process.env.PORT || 5000
const dburl=process.env.DATABASE_URL


app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST","DELETE"],
    credentials:true
}))

app.use("uploads/profiles",express.static("uploads/profiles"))
app.use("uploads/messages/files",express.static("uploads/messages/files"))

app.use(cookieParser())
app.use(express.json())


app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes)
app.use("/api/messages",messageRoutes)



const server=app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

setupSocket(server)

mongoose.connect(dburl).then(()=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log(err)
})






