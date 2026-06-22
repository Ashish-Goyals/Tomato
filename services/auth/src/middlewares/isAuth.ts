import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: "Unauthorized access no token",
        cookies: req.cookies,
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as JwtPayload;

    req.user = decoded.user;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Please Login - JWT error",
    });
    return;
  }
};
// BUG8 FIX: isSeller was missing from resturant's own middleware
// route was importing it from ../../auth/middlewares which breaks service isolation
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
