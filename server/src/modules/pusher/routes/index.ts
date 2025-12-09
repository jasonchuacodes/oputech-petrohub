import express from 'express';

import { requireAuth } from '~/middlewares';

import { authenticateChannel } from '../controller/pusher.controller';

const router = express.Router();

router.post('/auth', requireAuth, authenticateChannel);

export default router;
