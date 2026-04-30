import mongoose from "mongoose";    

const connectDB = async ()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI as string,{
        dbName:"zomato_clone"
       })
        console.log(`MongoDB Connected `);
    } catch (error) {
        console.log("Error while connecting to mongodb",error);
        process.exit(1)
    }
}

export default connectDB; 