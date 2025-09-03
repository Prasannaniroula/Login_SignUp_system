import userModel from "../models/user.models.js";

export const getUserData = async (req,res)=>{

    try {
        const userID = req.userID;

        const user = await userModel.findById(userID);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        res.json({
            success:true, 
            userData:{
                name:user.name,
                isAccountVerrified:user.isAccountVerrified,
            }
        })
         
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}