import express from 'express';

import { asyncHandler } from '~/utils/async-handler';

import { createUser, getAllUsers, getUserById } from '../controller/user.controller';

const router = express.Router();

router.post('/', asyncHandler(createUser));
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
