import express from 'express';
import cors from 'cors';
import userRoutes from './modules/user/routes';
import authRoutes from './modules/auth/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

export { app };
