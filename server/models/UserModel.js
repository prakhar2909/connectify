// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import genSalt  from "bcrypt";


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    profilesetup:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:""
    },
    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
    },

})


userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        next();
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    next();
})

const User=mongoose.model('User',userSchema);

export default User
