import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../model/User.js";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized access no token" });
            return;
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
        if (!decoded || !decoded.user) {
            res.status(401).json({ message: "Unauthorized access invalid token" });
            return;
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Please Login - JWT error" });
    }
}
