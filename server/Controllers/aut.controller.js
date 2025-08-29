
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models";

export const register = async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false, msg:"Missing Details"})
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false, msg:"This user already exists in our DB"})
        }

     const hashPassword = await bcrypt.hash(password, 10);
         
      const user= new userModel({name, email, password:hashPassword})
      await user.save();

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'7d'})
      res.cookie('token',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        samesite:process.env.NODE_ENV ==='production' ? "none" : "strict",
        maxAge : 7*24*60*60*1000,

      });

      return res.status(200)

    } catch (error) {
       return res.status().json({success:false, msg:error.message})
        
    }
}