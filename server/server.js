import express from 'express';
import connectDB from './utils/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './route/user.route.js';

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const corsOption = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOption));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/user', userRoute);

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
  await connectDB();
});
