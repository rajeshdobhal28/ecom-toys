// server/src/controllers/agentController.ts
import logger from "../utils/logger";
import { Response, Request } from 'express';
import { UserPayload } from "../middlewares/auth";
import { getAgentResponse } from '../services/agentService';

interface AuthRequest extends Request {
    user?: UserPayload;
}

export const handleAgentChat = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        const userId = req.user?.id;

        if (!message || typeof message !== 'string') {
            return res.status(400).send({ status: 'error', message: 'Message is required.' });
        }

        const reply = await getAgentResponse(userId!, message);

        res.status(200).send({ status: 'success', data: { reply } });
    } catch (error: any) {
        logger.error('Error sending message', error);
        res.status(500).send({ status: 'error', message: 'Failed to send message.' });
    }
}
