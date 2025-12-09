import cookieParser from 'cookie-parser';
import express from 'express';

import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './modules/user/routes';
import authRoutes from './modules/auth/routes';
import tenantRoutes from './modules/tenant/routes';
import dashboardRoutes from './modules/dashboard/routes';
import timesheetRoutes from './modules/timesheet/routes';
import notificationRoutes from './modules/notification/routes';
import pusherRoutes from './modules/pusher/routes';
import { corsMiddleware } from './middlewares/corsMiddleware';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/timesheets', timesheetRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/notifications', notificationRoutes);
app.use('/pusher', pusherRoutes);
app.use(errorHandler);

export { app };
