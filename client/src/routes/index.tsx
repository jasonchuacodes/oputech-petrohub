import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { MainLayout } from '~/components/layouts/MainLayout';
import { ProtectedRoute } from '~/components/auth/ProtectedRoute';
import { BootstrapPage } from '~/pages/bootstrap';
import { DashboardPage } from '~/pages/dashboard';
import { HomePage } from '~/pages/home';
import { Login } from '~/pages/auth/login';
import { Register } from '~/pages/auth/register';
import { ReportsPage } from '~/pages/reports';
import { CreateTenantFlow } from '~/pages/tenant/create-tenant';
import { TimesheetsPage } from '~/pages/timesheets';
import { UsersPage } from '~/pages/users';
import { SetupLayout } from '../components/layouts';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/bootstrap" element={<BootstrapPage />} />

        <Route element={<SetupLayout />}>
          <Route path="/create-tenant" element={<CreateTenantFlow />} />
        </Route>

        {/* Routes that require a tenant */}
        <Route element={<MainLayout />}>
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
