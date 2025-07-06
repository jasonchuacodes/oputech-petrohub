import express from 'express';

import { asyncHandler } from '~/utils/async-handler';

import { register } from '../controller/auth.controller';

const router = express.Router();

router.post('/register', asyncHandler(register));

export default router;
