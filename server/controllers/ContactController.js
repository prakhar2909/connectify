import User from "../models/UserModel.js";

export const searchContacts = async (req,res,next)=>{
    try {
        // console.log(req.body);
        const searchItem=req.body.searchTerm;
        console.log(searchItem)

        if(!searchItem){
            return res.status(400).json({message:"All fields are required"}); 
        }
        else{

        // const user=req.user;
        // const {searchItem}=req.body();

        const userSearch=await User.find({$and:[{username:{$regex:searchItem,$options:"i"}},{_id:{$ne:req.id}}]});

        const searchedUserList=userSearch.map((user)=>({
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image
        }));

        res.status(200).json(searchedUserList);
        }


    } catch (error) {
        console.log(error);
    }
}