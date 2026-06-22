import express from "express";
const router = express.Router();

import { isAuth, isSeller, isResturantOwner } from "../middlewares/isAuth.js";
import {
  addResturant,
  fetchMyResturant,
  updateResturant,
} from "../controllers/resturant.js";
import uploadFile from "../middlewares/mutler.js";

router.post("/new", isAuth, isSeller, uploadFile, addResturant);
router.get("/my-resturant", isAuth, isSeller, fetchMyResturant);
router.put(
  "/my-resturant",
  isAuth,
  isSeller,
  isResturantOwner,
  uploadFile,
  updateResturant,
);
export default router;
