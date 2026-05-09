import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  forceUpdatePassword,
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
  updateLastTenant,
} from '../controller/auth.controller';

const router = express.Router();

// Public routes
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/forgot-password', asyncHandler(forgotPassword));

// Protected routes
router.post('/logout', logoutUser);
router.put('/change-password', requireAuth, asyncHandler(updatePassword));
router.put('/force-change-password', requireAuth, asyncHandler(forceUpdatePassword));
router.get('/me', requireAuth, asyncHandler(getMe));
router.patch('/last-tenant', requireAuth, asyncHandler(updateLastTenant));

export default router;
