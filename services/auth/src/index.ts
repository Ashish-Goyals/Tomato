import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.js";
import cors from "cors"
import cookieParser from "cookie-parser"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes)
connectDB();
app.listen(PORT,()=>{
    console.log(`Auth service is running on port ${PORT}`)
});