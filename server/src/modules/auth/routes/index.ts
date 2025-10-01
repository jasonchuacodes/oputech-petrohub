import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
} from '../controller/auth.controller';

const router = express.Router();

// Public routes
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

// Protected routes
router.post('/logout', logoutUser);
router.put('/change-password', requireAuth, asyncHandler(updatePassword));
router.get('/me', requireAuth, asyncHandler(getMe));

export default router;
