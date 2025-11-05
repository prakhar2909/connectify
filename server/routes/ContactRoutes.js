import {Router} from "express"
import { searchContacts } from "../controllers/ContactController.js"
import { verifytoken } from "../middleware/AuthMiddleware.js"


const contactRoutes=Router()


contactRoutes.post("/search",verifytoken,searchContacts)

export default contactRoutes