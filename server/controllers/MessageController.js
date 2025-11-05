import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";
import {mkdir, mkdirSync, renameSync, unlinkSync} from "fs"

export const getMessages = async (req,res,next)=>{
    try {
        const user1=req.id
        const user2=req.body.id

        const messages=await Message.find({
            $or:[
                {
                    sender:user1,
                    receipent:user2
                },
                {
                    sender:user2,
                    receipent:user1
                }
            ]
        }).sort({timestamp:1})

        res.status(200).json(messages)
        

    } catch (error) {
        console.log(error);
    }
}

export const uploadFile = async (req,res,next)=>{
    try {
        console.log(req.file)
        if(!req.file){
            return res.status(400).json({message:"File not found"})
        }

        const date=Date.now()
        let fileDir=`./uploads/messages/files/${date}`
        let fileName=`${fileDir}/${req.file.originalname}`

        mkdirSync(fileDir,{recursive:true})

        renameSync(req.file.path,fileName)

        return res.status(200).json({
            filePath:fileName
        })

    } catch (error) {
        console.log(error);
    }

}