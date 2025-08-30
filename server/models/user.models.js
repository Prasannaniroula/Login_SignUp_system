import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{type:String, required:true,},
    email:{type:String,required:true,unique:true,},
    password:{type:String, required:true,},
    verifyOtp:{type:String, default:'',},
    verifyOtpExpiryAt:{type:Number, default:0,},
    isAccountVerified:{ type:Boolean, default:false,},
    resetOtp:{type:Boolean, default:false},
    resetOtpExpireAt:{type:Number, default:0}


})


const userModel = mongoose.models.user || mongoose.model('user',userSchema);
export default userModel;