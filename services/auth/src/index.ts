import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/auth",authRoutes)
connectDB();
app.listen(PORT,()=>{
    console.log(`Auth service is running on port ${PORT}`)
});