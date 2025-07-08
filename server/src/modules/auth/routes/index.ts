import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { getMe, loginUser, logoutUser, registerUser } from '../controller/auth.controller';

const router = express.Router();

// Public routes
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

// Protected routes
router.post('/logout', requireAuth, logoutUser);
router.get('/me', requireAuth, getMe);

export default router;
