import userModel from "../models/user.models.js";

export const getUserData = async (req,res)=>{

    try {
        const userId = req.userId;
        console.log(userId);
        const user = await userModel.findById(userId);
        console.log(user);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        res.json({
            success:true, 
            userData:{
                name:user.fullname,
                isAccountVerified:user.isAccountVerified,
            }
        })
         
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}