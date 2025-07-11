import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import ProtectedRoute from '~/components/ProtectedRoute';
import { Home } from '~/pages/home';
import Login from '~/pages/login';
import Register from '~/pages/register';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route index path="/login" element={<Login />} />
      <Route index path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route index path="/" element={<Home />}></Route>
      </Route>
    </Route>,
  ),
);
