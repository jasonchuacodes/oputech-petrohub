import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { createUser, deleteUser, getAllUsers, getUserById, updateUser, resetPassword } from '../controller/user.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createUser));
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', requireAuth, asyncHandler(updateUser));
router.put('/:id/reset-password', requireAuth, asyncHandler(resetPassword));
router.delete('/:id', requireAuth, asyncHandler(deleteUser));

export default router;
