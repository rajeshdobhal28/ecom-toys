import express, { Request, Response } from 'express';

const app = express();
const port = 3001; // Using 3001 to avoid conflict with Next.js on 3000

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('WonderToys Backend is running!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
