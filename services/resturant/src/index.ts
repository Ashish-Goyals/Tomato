import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import resturantRoutes from "./routes/resturant.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Restaurant Service Hit:", req.method, req.url);
  next();
});

app.use("/api/resturant", resturantRoutes);
connectDB();

app.listen(PORT, () => {
  console.log(`Resturant service is running on port ${PORT}`);
});
