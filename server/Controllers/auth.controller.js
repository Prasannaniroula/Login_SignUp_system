import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    console.log("Details are missing check it!");
    return res.json({ success: false, msg: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("user already exists");
      return res.json({
        success: false,
        msg: "This user already exists in our DB",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ fullname, email, password: hashPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending welcome email

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome!! to Mern Authentication.",
      text: `Welcom to Mern Authentication website. Your account has been created with email id:${email}`,
    };
    console.log(process.env.SENDER_EMAIL);
    const sendemail = await transporter.sendMail(mailOptions);
    if (!sendemail) {
      return res
        .status(500)
        .json({ success: false, msg: "couldn't send email" });
    }

    // you may delete this later
    console.log("Registered User ID 👉", user._id);

    return res
      .status(200)
      .json({ success: true, msg: "successfully registered" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, msg: error.message, userId: user._id.toString() });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // checking if user have added email and passsword or not
  if (!email || !password) {
    console.log("email or password is missing");
    return res
      .status(400)
      .json({ success: false, msg: "email and password are required" });
  }

  try {
    // checking if user exist in the database or not
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("user doesnot exist in our DB");
      return res
        .status(400)
        .json({ success: false, msg: "User doesnot exist please register" });
    }
    //    checking if password is valid or not
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("password is not valid");
      return res
        .status(401)
        .json({ success: false, msg: "Password is not valid" });
    }

    // token generation during login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, msg: "Logged in successfully", userId: user._id });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, msg: "Logged out" });
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    const otpHtml = otp
      .split("")
      .map(
        (digit) => `
       <span style="
         display:inline-block;
         margin:5px;
         padding:15px 20px;
         font-size:20px;
         font-weight:bold;
         background-color:#f3f3f3;
         border-radius:8px;
         border:1px solid #ddd;
       ">${digit}</span>`
      )
      .join("");

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify OTP!! to Mern Authentication.",
      html: `
    <div style="font-family:sans-serif; text-align:center;">
          <h2>🔐 Your OTP Code</h2>
          <p>Please use the following OTP to verify your account:</p>
          <div style="margin-top:20px;">
            ${otpHtml}
          </div>
          <p style="margin-top:20px; color:gray; font-size:12px;">
            This OTP will expire in 10 minutes.
          </p>
        </div>`,
    };

    const sendemail = await transporter.sendMail(mailOptions);
    if (!sendemail) {
      return res
        .status(500)
        .json({ success: false, msg: "couldn't send email" });
    }
   

    return res
      .status(200)
      .json({ success: true, msg: "successfully send otp" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(501)
        .json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(401).json({ success: false, message: "Expired otp" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res
      .status(200)
      .json({ success: false, message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
