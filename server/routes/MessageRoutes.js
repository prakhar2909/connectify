import {Router} from "express"
import { verifytoken } from "../middleware/AuthMiddleware.js"
import { getMessages, uploadFile} from "../controllers/MessageController.js"
import multer from "multer"

const messageRoutes=Router()
const upload=multer({dest:'uploads/messages/files'})


messageRoutes.post("/get-message",verifytoken,getMessages)
messageRoutes.post("/get-file",verifytoken,upload.single('file'),uploadFile)




export default messageRoutes
