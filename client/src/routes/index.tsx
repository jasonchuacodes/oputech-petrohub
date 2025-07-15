import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import { DashboardLayout } from '~/components/layouts';
import ProtectedRoute from '~/components/ProtectedRoute';
import { Home } from '~/pages/home';
import Login from '~/pages/login';
import Register from '~/pages/register';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />}></Route>
        </Route>
      </Route>
    </Route>,
  ),
);
