import mongoose from "mongoose";

const connectDB = async ()=>{
    
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)

    mongoose.connection.on('connected', ()=> console.log("Database connected"));
}

export default connectDB;