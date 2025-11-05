// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import genSalt  from "bcrypt";



const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receipent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    messageType:{
        type:String,
        enum:["text","image","video","file"],
        required:true
    },
    content:{
        type:String,
        required:function(){
            return this.messageType === 'text'
        }
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType ==='file'
        }
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})


const Message=mongoose.model('Messages',messageSchema);

export default Message
