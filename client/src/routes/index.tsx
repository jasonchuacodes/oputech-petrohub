import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { ProtectedRoute } from '~/components/auth/ProtectedRoute';
import { RequireNoTenant } from '~/components/auth/RequireNoTenant';
import { RequireTenant } from '~/components/auth/RequireTenant';
import { AdminMainLayout, UserMainLayout, SetupLayout } from '~/components/layouts';
import { TenantProvider } from '~/context/tenant/TenantContext';
import { CreateTenantPage } from '~/pages/admin/tenant/create';
import { CreateTenantFlow } from '~/pages/admin/tenant/create-flow';
import { TenantSettingsPage } from '~/pages/admin/tenant/settings';
import { TimesheetsPage } from '~/pages/admin/timesheets';
import { UsersPage } from '~/pages/admin/users';
import { BootstrapPage } from '~/pages/admin/bootstrap';
import { HomePage } from '~/pages/admin/home';
import { ReportsPage } from '~/pages/admin/reports';
import { UserDetailPage } from '~/pages/admin/users/user-detail';
import { ForgotPassword } from '~/pages/auth/forgot-password';
import { Login } from '~/pages/auth/login';
import { Register } from '~/pages/auth/register';
import { HomePage as UserHomePage } from '~/pages/user/home';
import { TimesheetsPage as UserTimesheetsPage } from '~/pages/user/timesheets';
import { SettingsPage as UserSettingsPage } from '~/pages/user/settings';
import { AdminSettingsPage } from '~/pages/admin/settings';
import { NotFoundPage } from '~/pages/NotFound';
import { UnauthorizedPage } from '~/pages/Unauthorized';
import { UserRoleEnum } from '~/services/user/user.types';

export const PublicRoutes = {
  Login: '/login',
  Register: '/register',
  ForgotPassword: '/forgot-password',
  Unauthorized: '/unauthorized',
};

export const AdminRoutes = {
  Bootstrap: '/',
  TenantCreateFlow: '/create-tenant',
  TenantHome: '/tenants/:tenantId',
  TenantSettings: '/tenants/:tenantId/settings',
  TenantCreate: '/tenants/:tenantId/create-tenant',
  TenantReports: '/tenants/:tenantId/reports',
  TenantTimesheets: '/tenants/:tenantId/timesheets/:userId?',
  TenantUsers: '/tenants/:tenantId/users',
  TenantUserDetail: '/tenants/:tenantId/users/:userId',
  TenantUserTimesheetLogs: '/tenants/:tenantId/users/:userId/timesheets',
  TenantAccountSettings: '/tenants/:tenantId/account-settings',
};

export const UserRoutes = {
  Home: '/',
  Timesheets: '/timesheets',
  Settings: '/settings',
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path={PublicRoutes.Login} element={<Login />} />
      <Route path={PublicRoutes.Register} element={<Register />} />
      <Route path={PublicRoutes.ForgotPassword} element={<ForgotPassword />} />

      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={[UserRoleEnum.USER]} />}>
        <Route element={<UserMainLayout />}>
          <Route index element={<UserHomePage />} />
          <Route path={UserRoutes.Timesheets} element={<UserTimesheetsPage />} />
          <Route path={UserRoutes.Settings} element={<UserSettingsPage />} />
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
            <Route path="reports" element={<ReportsPage />} />
            <Route path="timesheets/:userId?" element={<TimesheetsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
            <Route path="create-tenant" element={<CreateTenantPage />} />
            <Route path="settings" element={<TenantSettingsPage />} />
            <Route path="account-settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path={PublicRoutes.Unauthorized} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
