import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { createUser, getAllUsers, getUserById } from '../controller/user.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createUser));
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
