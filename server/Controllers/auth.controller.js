import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";

export const register = async(req, res)=>{
    const {fullname, email, password} = req.body;

    if(!fullname || !email || !password){
        console.log("Details are missing check it!")
        return res.json({success:false, msg:"Missing Details"})
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
          console.log("user already exists")
            return res.json({success:false, msg:"This user already exists in our DB"})
            
        }

     const hashPassword = await bcrypt.hash(password, 10);
         
      const user= new userModel({fullname, email, password:hashPassword})
      await user.save();

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'7d'})
      res.cookie('token',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        samesite:process.env.NODE_ENV ==='production' ? "none" : "strict",
        maxAge : 7*24*60*60*1000,

      });

      return res.status(200).json({success:true, msg:"successfully registered"})

    } catch (error) {
       return res.status(400).json({success:false, msg:error.message})
        
    }
}


export const login = async(req,res)=>{
    const {email,password} = req.body;

    // checking if user have added email and passsword or not
     if(!email || !password){
        console.log("email or password is missing");
        return res.status(400).json({success:false, msg:"email and password are required"})
     }


  try {

        // checking if user exist in the database or not
      const user = await userModel.findOne({email})
      if(!user){
         console.log("user doesnot exist in our DB");
          return res.status(400).json({success:false,msg:"User doesnot exist please register"})
      }
    //    checking if password is valid or not
      const isPasswordValid = await bcrypt.compare(password,user.password)
      if(!isPasswordValid){
        console.log("password is not valid");
        return res.status(401).json({success:false, msg:"Password is not valid"})
      }

         // token generation during login
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'7d'})
      res.cookie('token',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        samesite:process.env.NODE_ENV ==='production' ? "none" : "strict",
        maxAge : 7*24*60*60*1000,

      });

      return res.status(200).json({success:true, msg:"Logged in successfully"})



  } catch (error) {
    return res.status(400).json({success:false,msg:error.message})
    
  }

}


export const logout = async( req, res)=>{
  try {
    res.clearCookie('token',{
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      samesite:process.env.NODE_ENV ==='production' ? "none" : "strict",

    })

    return res.status(400).json({success:true, msg:"Logged out"})
    
  } catch (error) {
    return res.status(400).json({success:false,msg:error.message})
    
  }
}