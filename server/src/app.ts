import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import userRoutes from './modules/user/routes';
import authRoutes from './modules/auth/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

export { app };
