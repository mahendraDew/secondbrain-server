import { Router, Request, Response } from "express";
import { TagModel } from "../db";


const tagRouter = Router();

tagRouter.get("/test", (req: Request, res: Response)=>{
    res.json({
        msg: "this is tag /test route!!!"
    })
})

tagRouter.post('/createtag', async (req: Request, res: Response) => {
    try {
        const {title} = req.body;

        await TagModel.create({
            title,
        })
        res.status(201).json({
            msg: `Tag is created`
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error: something went wrong!",
            error: error,
        });
    }
})

tagRouter.get('/alltags', async(req:Request, res:Response)=>{
    try {
        const tags = await TagModel.find({}, '_id title'); 
    
        res.status(200).json({
          tags, 
        });
      } catch (error) {
        res.status(500).json({
          msg: 'Error: Something went wrong!',
          error: error
        });
    }
})




export default tagRouter;