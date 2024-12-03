import express , { Request, Response} from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user';
import tagRouter from './routes/tag';
import connectDB from './config/db';
import contentRouter from './routes/content';
import { TagModel } from './db';
import brainRouter from './routes/brain';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/healthy', (req: Request, res: Response) => {
    res.json({
        msg: "I am healthy"
    })
})


app.use('/api/v1/user', userRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/tag', tagRouter)
app.use('/api/v1/brain', brainRouter);

function main(){
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT} at http://localhost:3000`)
        connectDB()
        
    })
}
main()

export default app;