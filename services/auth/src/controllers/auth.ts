import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from '../middlewares/isAuth.js';
import { oauth2client } from '../config/googleConfig.js';
import axios from 'axios';

export const loginUser = TryCatch(async(req,res)=>{

       const {code} = req.body;
       if(!code){
        return res.status(400).json({message:"Authorization code is required"})
       }
       const googleResponse = await oauth2client.getToken(code)
       oauth2client.setCredentials(googleResponse.tokens);

       const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)

     // Input getting from googleapis from req.body
        const {email,name,picture} = userResponse.data;
        let user = await User.findOne({email});
        if(!user){
            user = await User.create({
                // data submission in mongodb by the use of user model 
                name,
                email,
                image:picture
            })

        }

        const token = jwt.sign({ user }, process.env.SECRET_KEY as string, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user });
})
export const logoutUser = TryCatch(async(req, res)=>{
    res.clearCookie("token", { httpOnly: true });
    res.json({ message: "Logged out successfully" });
})
const allowedRoles = ["customer","rider","seller"] as const ;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user?._id){
        return res.status(401).json({message:"Access Denied"})
    }
const {role} = req.body as {role:Role};

if(!allowedRoles.includes(role)){
    return res.status(400).json({message:"Invalid Role"} )
}

const user = await User.findByIdAndUpdate(req.user._id, {role}, {returnDocument: 'after'})
if(!user){
    return res.status(404).json({message:"User not found"})
}
const token = jwt.sign({ user }, process.env.SECRET_KEY as string, { expiresIn: "7d" });
res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
res.json({ user });
})

export const myProfile = TryCatch(async(req:AuthenticatedRequest,res)=>{
   const user = req.user
   res.json({ user });
})