import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";
import transporter from "../config/nodemailer.js";

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

      // sending welcome email

      const mailOptions ={
        from: process.env.SENDER_EMAIL,
        to:email,
        subject:'Welcome!! to Mern Authentication.',
        text:`Welcom to Mern Authentication website. Your account has been created with email id:${email}`

      } 
      console.log(process.env.SENDER_EMAIL);
      const sendemail = await transporter.sendMail(mailOptions);
      if(!sendemail){
        return res.status(500).json({success:false, msg:"couldn't send email"});
      }

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

    return res.status(200).json({success:true, msg:"Logged out"})
    
  } catch (error) {
    return res.status(400).json({success:false,msg:error.message})
    
  }
}

export const verifyOtp = async(req,res)=>{
  try {
    const {userId} = req.body;
    const user = await userModel.findById(userId)
    if(user.isAccountVerified){

       return res.json({success:false, message:"Account already verified"});
    }

   const otp=String(Math.floor(100000 + Math.random()*900000));
   user.verifyOtp= otp;
   user.verifyOtpExpireAt= Date.now() + 10*60*1000

   await user.save();
   const mailOptions ={
    from: process.env.SENDER_EMAIL,
    to:user.email,
    subject:'Verify OTP!! to Mern Authentication.',
    text:`<>
    <h1>Your OTP is:</h1>
       <div></div>
    </>
      
     `
  } 



    
  } catch (error) {
    return res.status(400).json({success:false, message:error.message})
  }
}
