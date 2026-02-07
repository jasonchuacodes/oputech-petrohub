import cookieParser from 'cookie-parser';
import express from 'express';

import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './modules/user/routes';
import authRoutes from './modules/auth/routes';
import tenantRoutes from './modules/tenant/routes';
import timesheetRoutes from './modules/timesheet/routes';
import notificationRoutes from './modules/notification/routes';
import pusherRoutes from './modules/pusher/routes';
import shiftRoutes from './modules/shift/routes';
import reportRoutes from './modules/report/routes';
import productRoutes from './modules/product/routes';
import inventoryRoutes from './modules/inventory/routes';
import analyticsRoutes from './modules/analytics/routes';
import salaryRoutes from './modules/salary/routes';
import payrollRoutes from './modules/payroll/routes';
import { corsMiddleware } from './middlewares/corsMiddleware';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/timesheets', timesheetRoutes);
app.use('/notifications', notificationRoutes);
app.use('/pusher', pusherRoutes);
app.use('/shifts', shiftRoutes);
app.use('/reports', reportRoutes);
app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/salary-rates', salaryRoutes);
app.use('/payroll', payrollRoutes);
app.use(errorHandler);

export { app };
