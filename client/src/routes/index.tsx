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
import { PayrollPage } from '~/pages/admin/payroll';
import { RunPayrollPage } from '~/pages/admin/payroll/run-payroll';
import { PayrollRunDetailPage } from '~/pages/admin/payroll/payroll-run-detail';
import { BootstrapPage } from '~/pages/admin/bootstrap';
import { HomePage } from '~/pages/admin/home';
import { ProductsPage } from '~/pages/admin/products';
import { InventoryPage } from '~/pages/admin/inventory';
import { ReportsPage } from '~/pages/admin/reports';
import { ReportDetailPage } from '~/pages/admin/reports/report-detail';
import { ShiftsPage } from '~/pages/admin/shifts';
import { UserDetailPage } from '~/pages/admin/users/user-detail';
import { ForgotPassword } from '~/pages/auth/forgot-password';
import { Login } from '~/pages/auth/login';
import { LoginAdmin } from '~/pages/auth/admin-login';
import { Register } from '~/pages/auth/register';
import { HomePage as UserHomePage } from '~/pages/user/home';
import { TimesheetsPage as UserTimesheetsPage } from '~/pages/user/timesheets';
import { ReportDetailPage as UserReportDetailPage } from '~/pages/user/report';
import { ReportDisposalPage } from '~/pages/user/report/disposal';
import { SettingsPage as UserSettingsPage } from '~/pages/user/settings';
import { AdminSettingsPage } from '~/pages/admin/settings';
import { NotFoundPage } from '~/pages/NotFound';
import { UnauthorizedPage } from '~/pages/Unauthorized';
import { UserRole } from '~/services/user/user.types';

export const PublicRoutes = {
  Login: '/login',
  LoginAdmin: '/admin/login',
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
  TenantReportDetails: '/tenants/:tenantId/reports/:reportId',
  TenantTimesheets: '/tenants/:tenantId/timesheets/:userId?',
  TenantShifts: '/tenants/:tenantId/shifts',
  TenantProducts: '/tenants/:tenantId/products',
  TenantInventory: '/tenants/:tenantId/inventory',
  TenantUsers: '/tenants/:tenantId/users',
  TenantUserDetail: '/tenants/:tenantId/users/:userId',
  TenantUserTimesheetLogs: '/tenants/:tenantId/users/:userId/timesheets',
  TenantPayroll: '/tenants/:tenantId/payroll',
  TenantRunPayroll: '/tenants/:tenantId/payroll/run',
  TenantPayrollRunDetail: '/tenants/:tenantId/payroll/:payrollRunId',
  TenantAccountSettings: '/tenants/:tenantId/account-settings',
};

export const UserRoutes = {
  Home: '/',
  Timesheets: '/timesheets',
  Settings: '/settings',
  Report: '/report',
  ReportDetail: '/report/:reportId',
  ReportDisposal: '/report/:reportId/disposal',
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path={PublicRoutes.Login} element={<Login />} />
      <Route path={PublicRoutes.LoginAdmin} element={<LoginAdmin />} />
      <Route path={PublicRoutes.Register} element={<Register />} />
      <Route path={PublicRoutes.ForgotPassword} element={<ForgotPassword />} />

      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={[UserRole.USER]} />}>
        <Route element={<UserMainLayout />}>
          <Route index element={<UserHomePage />} />
          <Route path={UserRoutes.Timesheets} element={<UserTimesheetsPage />} />
          <Route path={UserRoutes.Settings} element={<UserSettingsPage />} />
          <Route path={UserRoutes.ReportDetail} element={<UserReportDetailPage />} />
          <Route path={UserRoutes.ReportDisposal} element={<ReportDisposalPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
        <Route index element={<BootstrapPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
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
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="reports/:reportId" element={<ReportDetailPage />} />
            <Route path="timesheets/:userId?" element={<TimesheetsPage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="payroll/run" element={<RunPayrollPage />} />
            <Route path="payroll/:payrollRunId" element={<PayrollRunDetailPage />} />
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
