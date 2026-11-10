import { Navigate, Route, Routes } from 'react-router-dom'
import { MorePage } from './features/account/more-page'
import { AttendancePage } from './features/attendance/attendance-page'
import { LoginPage } from './features/auth/login-page'
import { ChangePasswordPage } from './features/auth/change-password-page'
import { ProtectedRoute } from './features/auth/protected-route'
import { DashboardPage } from './features/dashboard/dashboard-page'
import { AppShell } from './features/layout/app-shell'
import { OnboardingPage } from './features/onboarding/onboarding-page'
import { ReportsPage } from './features/reports/reports-page'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/reports" replace />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="more" element={<MorePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  )
}
