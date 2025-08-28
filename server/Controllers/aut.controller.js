
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models";

export const register = async(req, res)=>{
    const [ name, email, password] = req.body;

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

    } catch (error) {
        res.json({success:false, msg:error.msg})
        
    }
}