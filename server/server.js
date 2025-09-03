import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";


const app = express();
const port = process.env.PORT || 8000 ;

const isConnected= connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));


// API Endpoints
app.get('/',(req,res)=>res.send('Api working'));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.get('/',(req,res)=>{
    res.send("hello welcome to the api working")
})

if(isConnected){
    console.log("database connected successfully")
app.listen(port,()=>{
    console.log(`Your server is running on: http://localhost:${port}`)
})
}