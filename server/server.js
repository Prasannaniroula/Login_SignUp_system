import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import "dotenv/config";
import connectDB from "./config/mongodb.js";


const app = express();
const port = process.env.PORT || 8000 ;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));


app.get('/',(req,res)=>{
    res.send("hello welcome to the api working")
})


app.listen(port,()=>{
    console.log(`Your server is running on: http://localhost:${port}`)
})
