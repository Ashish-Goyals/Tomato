import express from "express";
const router = express.Router();

// BUG9 FIX: was importing from ../../auth/middlewares/isAuth.js (cross-service import)
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { addResturant, fetchMyResturant } from "../controllers/resturant.js";
import uploadFile from "../middlewares/mutler.js";

router.post("/new", isAuth, isSeller, uploadFile, addResturant);
router.get("/my-resturant", isAuth, isSeller, fetchMyResturant);
export default router;
