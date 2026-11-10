import { Navigate, Route, Routes } from 'react-router-dom'
import { MePage } from './features/account/me-page'
import { AttendancePage } from './features/attendance/attendance-page'
import { LoginPage } from './features/auth/login-page'
import { ChangePasswordPage } from './features/auth/change-password-page'
import { ProtectedRoute } from './features/auth/protected-route'
import { DashboardPage } from './features/dashboard/dashboard-page'
import { AppShell } from './features/layout/app-shell'
import { OnboardingPage } from './features/onboarding/onboarding-page'
import { ReportsPage } from './features/reports/reports-page'
import { TenantsPage } from './features/tenants/tenants-page'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<DashboardPage />} />
          <Route path="report" element={<ReportsPage />} />
          <Route path="timesheet" element={<AttendancePage />} />
          <Route path="me" element={<MePage />} />
          <Route path="tenants" element={<TenantsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
