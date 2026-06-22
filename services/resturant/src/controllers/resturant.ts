import axios from "axios";
import jwt from "jsonwebtoken";

import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";

import Resturant from "../model/Resturant.js";
import getBuffer from "../config/datauri.js";

/**
 * Create Restaurant
 */
export const addResturant = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access Denied",
    });
  }

  const existingResturant = await Resturant.findOne({
    owner: user._id,
  });

  if (existingResturant) {
    return res.status(400).json({
      success: false,
      message: "You already own a restaurant",
    });
  }

  const { name, description, latitude, longitude, formattedAddress, phone } =
    req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Name, latitude and longitude are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Restaurant image is required",
    });
  }

  const imageBuffer = getBuffer(req.file);

  if (!imageBuffer) {
    return res.status(400).json({
      success: false,
      message: "Invalid image file",
    });
  }

  const { data } = await axios.post(`${process.env.UTIL_SERVICE}/api/upload`, {
    buffer: imageBuffer.content,
  });

  const resturant = await Resturant.create({
    owner: user._id,
    name,
    description,
    phone,
    image: data.url,
    formattedAddress,
    autoLocation: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    },
  });

  return res.status(201).json({
    success: true,
    message: "Restaurant created successfully",
    resturant,
  });
});

export const fetchMyResturant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access Denied",
      });
    }

    const resturant = await Resturant.findOne({
      owner: user._id,
    });

    if (!resturant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const token = jwt.sign(
      {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          resturantId: resturant._id,
        },
      },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "15m",
      },
    );

    return res.status(200).json({
      success: true,
      resturant,
      token,
    });
  },
);


export const updateResturant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const resturant = req.resturant;

    if (!resturant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const {
      name,
      description,
      phone,
      address,
      latitude,
      longitude,
      formattedAddress,
      isOpen,
    } = req.body;

    if (name) resturant.name = name;
    if (description !== undefined) resturant.description = description;
    if (phone !== undefined) resturant.phone = phone;
    if (address !== undefined) resturant.formattedAddress = address;
    if (formattedAddress !== undefined)
      resturant.formattedAddress = formattedAddress;
    if (isOpen !== undefined) resturant.isOpen = isOpen === "true";
    if (latitude && longitude) {
      resturant.autoLocation = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      };
    }

    if (req.file) {
      const imageBuffer = getBuffer(req.file);

      if (!imageBuffer) {
        return res.status(400).json({
          success: false,
          message: "Invalid image file",
        });
      }

      const { data } = await axios.post(
        `${process.env.UTIL_SERVICE}/api/upload`,
        {
          buffer: imageBuffer.content,
        },
      );

      resturant.image = data.url;
    }

    await resturant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      resturant,
    });
  },
);
