import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { App } from '~/App';
import HomePage from '~/pages/Home';
import Register from '~/pages/Register';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route index path="/" element={<HomePage />} />
      <Route index path="/register" element={<Register />} />
    </Route>,
  ),
);
