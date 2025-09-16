import userModel from "../models/user.models.js";

export const getUserData = async (req,res)=>{

    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        res.json({
            success:true, 
            userData:{
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                createdAt: user.createdAt,
            }
        })
         
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}