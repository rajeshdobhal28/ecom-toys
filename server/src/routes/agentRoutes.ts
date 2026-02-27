// server/src/routes/agentRoutes.ts
import express from 'express';
import * as agentController from '../controllers/agentController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// The new endpoint for our Agentic AI!
router.post('/send/message', authenticate, agentController.handleAgentChat);

export default router;
