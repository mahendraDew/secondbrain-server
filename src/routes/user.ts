import { Router, Request, Response } from "express";
import {z} from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "../db";
import userMiddleware from "../middleware/usermiddleware";
const USER_JWT_SECRET=process.env.USER_JWT_SECRET || "JsonewbtokenSECRET";


const userRouter = Router();

userRouter.get("/test", (req: Request, res: Response)=>{
    res.json({
        msg: "this is testing route!!!"
    })
})

userRouter.post('/signup', async(req: Request, res: Response) => {
    
    const requiredBody = z.object({
        email: z.string().min(1).max(30),
        username: z.string().min(1).max(30),
        password: z.string().min(8).max(25)
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.status(400).json({
            msg: "something went wrong in server!"
        })
    }
    const { email, username , password } = req.body;


    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        console.log("hashedpassword: ",hashedPassword);
        await UserModel.create({
            email,
            username,
            password: hashedPassword
        })
        res.json({
            msg: "user signed up successfully"
        })
    } catch (error) {
        res.status(511).json({
            msg:"Something went wrong!"
        })
    }
})

userRouter.post('/signin', async(req: Request, res: Response)=>{
    // Implement user login logic
    const username = req.body.username;
    const password = req.body.password;
   
    const user = await UserModel.findOne({
       username: username
    })

    if(!user){
       res.status(403).json({
           msg: "user not found!"
       })
       return;
    }
    //todo: check for the hashed password
    const passMatch = user.password ? await bcrypt.compare(password, user.password) : false;

    if(passMatch){
       const token = jwt.sign({
           id: user._id.toString()
       }, USER_JWT_SECRET);
       console.log("token: ", token);
       res.json({
           token: token,
           user: {
               "id": user._id,
               "username": user.username,
               "email": user.email
           }
       })
    }else{
       res.status(405).json({
           msg: "incorrect creadentials"
       })
    }
})


interface User {
    _id: string;
    email: string;
    username: string;
    // Add other fields if necessary
}
interface CustomRequest extends Request {
    user?: User;
}
userRouter.post('/contents', userMiddleware, async(req: CustomRequest, res: Response): Promise<void> =>{

    try {
        const userId = req.user?._id;

        // Fetch all content for the user from the database
        const content = await ContentModel.find({ userId: userId }).populate({
            path: 'tags', // Field to populate
            select: 'title', 
        }); 

        // Send the content as a response
        res.status(200).json(content);
        return ;
    } catch (error) {
        console.error(error);
        
        // Check if response has already been sent
        res.status(500).json({ msg: 'Internal Server Error' });
        return ;
    }
})


export default userRouter;