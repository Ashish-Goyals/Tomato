import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import Resturant from "../model/Resturant.js";
import getBuffer from "../config/datauri.js";
import axios from "axios";

export const addResturant = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized Access Denied" });
  }

  const existingResturant = await Resturant.findOne({ owner: user._id });
  if (existingResturant) {
    return res.status(400).json({ message: "You already have a resturant" });
  }

  const { name, description, latitude, longitude, formattedAddress, phone } =
    req.body;

  if (!name || !latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Name, latitude and longitude are required" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer) {
    return res.status(400).json({ message: "Invalid image file" });
  }

  const { data: uploadResult } = await axios.post(
    `${process.env.UTIL_SERVICE}/api/upload`,
    { buffer: fileBuffer.content },
  );

  const resturant = await Resturant.create({
    owner: user._id,
    name,
    description,
    phone,
    image: uploadResult.url,
    autoLocation: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    },
    formattedAddress,
  });

  return res
    .status(201)
    .json({ message: "Resturant created successfully", resturant });
});

export const fetchMyResturant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Access Denied" });
    }

    const resturant = await Resturant.findOne({ owner: user._id });
    if (!resturant) {
      return res.status(404).json({ message: "Resturant not found" });
    }

    return res.status(200).json({ resturant });
  },
);
