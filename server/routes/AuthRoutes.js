import {Router} from "express"
import {signup,login,userinfo,saveChanges,uploadImage,deleteImage,userupdate,logout} from "../controllers/AuthController.js"
import { verifytoken } from "../middleware/AuthMiddleware.js"
import multer from 'multer'



const authRoutes=Router()
const upd=multer({dest:'uploads/profiles/'})


authRoutes.post("/signup",signup)
authRoutes.post("/login",login)
authRoutes.post("/logout",logout)
authRoutes.get("/user",verifytoken,userinfo)
authRoutes.get("/user-info",verifytoken,userupdate)
authRoutes.post("/updateprofile",verifytoken,saveChanges)
authRoutes.post("/upload-image",verifytoken,upd.single('image'),uploadImage)
authRoutes.delete("/delete-image",verifytoken,deleteImage)

export default authRoutes



