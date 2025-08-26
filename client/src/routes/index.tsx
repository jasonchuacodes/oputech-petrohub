import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { ProtectedRoute } from '~/components/auth/ProtectedRoute';
import { RequireNoTenant } from '~/components/auth/RequireNoTenant';
import { RequireTenant } from '~/components/auth/RequireTenant';
import { AdminMainLayout, UserMainLayout, SetupLayout } from '~/components/layouts';
import { TenantProvider } from '~/context/tenant/TenantContext';
import { DashboardPage } from '~/pages/admin/dashboard';
import { CreateTenant } from '~/pages/admin/tenant/create';
import { CreateTenantFlow } from '~/pages/admin/tenant/create-flow';
import { TimesheetsPage } from '~/pages/admin/timesheets';
import { UsersPage } from '~/pages/admin/users';
import { BootstrapPage } from '~/pages/admin/bootstrap';
import { HomePage } from '~/pages/admin/home';
import { ReportsPage } from '~/pages/admin/reports';
import { UserDetailPage } from '~/pages/admin/users/user-detail';
import { Login } from '~/pages/auth/login';
import { Register } from '~/pages/auth/register';
import { HomePage as UserHomePage } from '~/pages/user/home';
import { NotFoundPage } from '~/pages/NotFound';
import { UnauthorizedPage } from '~/pages/Unauthorized';
import { UserRoleEnum } from '~/services/user/user.types';

export const PublicRoutes = {
  Login: '/login',
  Register: '/register',
  Unauthorized: '/unauthorized',
};

export const AdminRoutes = {
  Bootstrap: '/',
  TenantCreateFlow: '/create-tenant',
  TenantHome: '/tenants/:tenantId',
  TenantCreate: '/tenants/:tenantId/create-tenant',
  TenantDashboard: '/tenants/:tenantId/dashboard',
  TenantReports: '/tenants/:tenantId/reports',
  TenantTimesheets: '/tenants/:tenantId/timesheets',
  TenantUsers: '/tenants/:tenantId/users',
  TenantUserDetail: '/tenants/:tenantId/users/:userId',
};

export const UserRoutes = {
  Home: '/',
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path={PublicRoutes.Login} element={<Login />} />
      <Route path={PublicRoutes.Register} element={<Register />} />

      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={[UserRoleEnum.USER]} />}>
        <Route element={<UserMainLayout />}>
          <Route index element={<UserHomePage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRoleEnum.ADMIN]} />}>
        <Route index element={<BootstrapPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[UserRoleEnum.ADMIN]} />}>
        <Route element={<RequireNoTenant />}>
          <Route element={<SetupLayout />}>
            <Route path={AdminRoutes.TenantCreateFlow} element={<CreateTenantFlow />} />
          </Route>
        </Route>

        <Route
          path={AdminRoutes.TenantHome + '/*'}
          element={
            <TenantProvider>
              <RequireTenant />
            </TenantProvider>
          }
        >
          <Route element={<AdminMainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="timesheets" element={<TimesheetsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
            <Route path="create-tenant" element={<CreateTenant />} />
          </Route>
        </Route>
      </Route>

      <Route path={PublicRoutes.Unauthorized} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
