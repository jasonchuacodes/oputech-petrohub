import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { RequireTenant } from '~/components/auth/RequireTenant';
import { RequireNoTenant } from '~/components/auth/RequireNoTenant';
import { MainLayout, SetupLayout } from '~/components/layouts';
import { ProtectedRoute } from '~/components/auth/ProtectedRoute';
import { TenantProvider } from '~/context/tenant/TenantContext';
import { BootstrapPage } from '~/pages/bootstrap';
import { DashboardPage } from '~/pages/dashboard';
import { HomePage } from '~/pages/home';
import { Login } from '~/pages/auth/login';
import { Register } from '~/pages/auth/register';
import { ReportsPage } from '~/pages/reports';
import { CreateTenantFlow } from '~/pages/tenant/create';
import { TimesheetsPage } from '~/pages/timesheets';
import { UsersPage } from '~/pages/users';

export const Routes = {
  Bootstrap: '/',
  Login: '/login',
  Register: '/register',
  CreateTenant: '/create-tenant',
  TenantHome: '/tenants/:tenantId',
  TenantDashboard: '/tenants/:tenantId/dashboard',
  TenantReports: '/tenants/:tenantId/reports',
  TenantTimesheets: '/tenants/:tenantId/timesheets',
  TenantUsers: '/tenants/:tenantId/users',
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path={Routes.Login} element={<Login />} />
      <Route path={Routes.Register} element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path={Routes.Bootstrap} element={<BootstrapPage />} />

        {/* Routes for users without a tenant */}
        <Route element={<RequireNoTenant />}>
          <Route element={<SetupLayout />}>
            <Route path={Routes.CreateTenant} element={<CreateTenantFlow />} />
          </Route>
        </Route>

        {/* Routes with a tenant */}
        <Route
          path={Routes.TenantHome + '/*'}
          element={
            <TenantProvider>
              <RequireTenant />
            </TenantProvider>
          }
        >
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="timesheets" element={<TimesheetsPage />} />

            {/* Users */}
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);
