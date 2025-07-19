import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { RequireTenant } from '~/components/auth/RequireTenant';
import { RequireNoTenant } from '~/components/auth/RequireNoTenant';
import { MainLayout, SetupLayout } from '~/components/layouts';
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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/bootstrap" element={<BootstrapPage />} />

        {/* Routes for users without a tenant */}
        <Route element={<RequireNoTenant />}>
          <Route element={<SetupLayout />}>
            <Route path="/create-tenant" element={<CreateTenantFlow />} />
          </Route>
        </Route>

        {/* Routes with a tenant */}
        <Route element={<RequireTenant />}>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="/dashboard" element={<DashboardPage />}></Route>
            <Route path="/reports" element={<ReportsPage />}></Route>
            <Route path="/timesheets" element={<TimesheetsPage />}></Route>
            <Route path="/users" element={<UsersPage />}></Route>
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);
