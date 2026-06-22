import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Resturant from "../model/Resturant.js"; // 👈 add this

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  resturantId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
  resturant?: any;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      res.status(401).json({
        message: "Unauthorized access no token",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as JwtPayload;

    if (!decoded || !decoded.user) {
      res.status(401).json({
        message: "Unauthorized access invalid token",
      });
      return;
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Please Login - JWT error",
    });
    return;
  }
};

export const isSeller = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user;
  if (!user || user.role !== "seller") {
    res.status(403).json({ message: "Access Denied - Seller only" });
    return;
  }
  next();
};

export const isResturantOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  const resturant = await Resturant.findOne({
    owner: user._id,
  });

  if (!resturant) {
    res.status(404).json({
      message: "Restaurant not found",
    });
    return;
  }

  if (resturant.owner.toString() !== user._id.toString()) {
    res.status(403).json({
      message: "Access Denied - You do not own this restaurant",
    });
    return;
  }

  req.resturant = resturant; // 👈 no more `as any` needed
  next();
};
