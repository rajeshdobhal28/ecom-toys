require('dotenv').config();
import express, { Request, Response } from 'express';
import authRoutes from './routes/auth';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3001; // Using 3001 to avoid conflict with Next.js on 3000

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('WonderToys Backend is running!');
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
