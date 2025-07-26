import cookieParser from 'cookie-parser';
import express from 'express';

import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './modules/user/routes';
import authRoutes from './modules/auth/routes';
import tenantRoutes from './modules/tenant/routes';
import { corsMiddleware } from './middlewares/corsMiddleware';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use(errorHandler);

export { app };
