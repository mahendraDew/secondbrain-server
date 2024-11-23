import express , { Request, Response} from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user';
import connectDB from './config/db';
import contentRouter from './routes/content';
import { TagModel } from './db';
import brainRouter from './routes/brain';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthy', (req: Request, res: Response) => {
    res.json({
        msg: "I am healthy"
    })
})
app.post('/tag', async (req: Request, res: Response) => {
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


app.use('/api/v1/user', userRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/brain', brainRouter);

function main(){
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT} at http://localhost:3000`)
        connectDB()
        
    })
}
main()