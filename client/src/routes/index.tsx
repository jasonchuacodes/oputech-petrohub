import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { DashboardLayout } from '~/components/layouts';
import ProtectedRoute from '~/components/ProtectedRoute';
import DashboardPage from '~/pages/dashboard';
import HomePage from '~/pages/home';
import Login from '~/pages/login';
import Register from '~/pages/register';
import ReportsPage from '~/pages/reports';
import TimesheetsPage from '~/pages/timesheets';
import UsersPage from '~/pages/users';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />}></Route>
          <Route path="/dashboard" element={<DashboardPage />}></Route>
          <Route path="/reports" element={<ReportsPage />}></Route>
          <Route path="/timesheets" element={<TimesheetsPage />}></Route>
          <Route path="/users" element={<UsersPage />}></Route>
        </Route>
      </Route>
    </Route>,
  ),
);
