import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import {renameSync, unlinkSync} from "fs"


const createToken=(email,id)=>{
    return jwt.sign({email,id},process.env.JS_KEY)
}

export const signup = async (req,res,next)=>{
    try {
        const {email,password,username}=req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const user=await User.create({email,password,username})
        res.cookie("jwt",createToken(email,user.id),{
            maxAge:24*60*60*1000,
            secure:true,
            sameSite:"none"
        })

        return res.status(201).json({
            id:user.id,
            email:user.email,
            userName:user.username,
            profilesetup:user.profilesetup
        })
        
    } catch (error) {
        console.log(error);

    }
}
export const login = async (req,res,next)=>{
    try {
        const {email,password}=req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({email})

        
        if(!user){
            // alert("Invalid Credentials")
            return res.status(400).json({message:"Invalid Email"})
        }

        res.cookie("jwt",createToken(email,user.id),{
            maxAge:24*60*60*1000,
            secure:true,
            sameSite:"none"
        })

        const auth=await compare(password,user.password)

        if(!auth){
            return res.status(400).json({message:"Invalid Password"})
        }

        return res.status(200).json({
            id:user.id,
            email:user.email,
            userName:user.username,
            profilesetup:user.profilesetup
        })
        
    } catch (error) {
        console.log(error);
    }
}
export const userinfo = async (req,res,next)=>{
    try {
        const user=await User.findById(req.id)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        else{
            return res.status(200).json({
                id:user.id,
                email:user.email,
                userName:user.username,
                profilesetup:user.profilesetup
            })

        }
        
    } catch (error) {
        console.log(error);
    }
}
export const userupdate = async (req,res,next)=>{
    try {
        const user=await User.findById(req.id)
        console.log("kush")
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        else{
            return res.status(200).json({
                id:user.id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image
            })
            
        }
        
    } catch (error) {
        console.log(error);
    }
}

export const saveChanges = async (req,res,next)=>{
    try {
        const userId =req.id
        console.log(req.id)
        const {firstName,lastName,image}=req.body
        console.log(firstName,lastName,image)

        if(!firstName || !lastName){
            return res.status(400).json({message:"All fields are required"})
        }

        const user=await User.findByIdAndUpdate(userId,{
            firstName,
            lastName,
            image,
            profilesetup:true
        },{
            new:true,
            runValidators:true
        });
        // const user=await User.findById(userId).exec()

        // console.log(user)

        // user.firstName=firstName
        // user.lastName=lastName
        // user.image=image
        // user.profilesetup=true
        // await user.save()
       

        return res.status(200).json({
            id:userId,
            firstName:firstName,
            lastName:lastName,
            profilesetup:true,
            image:image
        })



    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Something went wrong"})
    }
}

export const uploadImage = async (req,res,next)=>{
    // console.log("hey");
    try {
        console.log(req.file)
        if(!req.file){
            return res.status(400).json({message:"File not found"})
        }

        const date=Date.now()
        let fileName=`./uploads/profiles/${date}-${req.file.originalname}`

        renameSync(req.file.path,fileName)

        const updatedUser=await User.findByIdAndUpdate(req.id,{
            image:fileName
        },{
            new:true,
            runValidators:true
        })

        return res.status(200).json({
            image:updatedUser.image
        })

    } catch (error) {
        console.log(error);
    }
}

export const deleteImage = async (req,res,next)=>{
    try {
        console.log(req.id)
        const user=await User.findByIdAndUpdate(req.id)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        if(user.image){
            unlinkSync(user.image)
        }
        user.image=null;
        await user.save();
        return res.status(200).json({
            image:user.image
        })

    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req,res,next)=>{
    try {
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"none"})
        return res.status(200).json({message:"Logout successful"})
    } catch (error) {
        console.log(error);
    }
}