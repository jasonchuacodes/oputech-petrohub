import express from 'express';

import { asyncHandler } from '~/utils/async-handler';

import { login, register } from '../controller/auth.controller';

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
