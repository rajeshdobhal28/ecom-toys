import express from 'express';
import * as chatController from '../controllers/chatController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/send/message', authenticate, chatController.handleChat);

export default router;