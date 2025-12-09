import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { authenticateChannel } from '../controller/pusher.controller';

const router = express.Router();

router.post('/auth', requireAuth, asyncHandler(authenticateChannel));

export default router;
