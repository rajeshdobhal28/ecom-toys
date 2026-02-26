import { Request, Response } from 'express';
import { sendContactEmail } from '../services/emailService';
import logger from '../utils/logger';

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).send({ status: 'error', message: 'All fields are required.' });
        }

        await sendContactEmail(name, email, subject, message);

        res.status(200).send({ status: 'success', message: 'Message sent successfully.' });
    } catch (error: any) {
        logger.error('Error submitting contact form', error);
        res.status(500).send({ status: 'error', message: 'Failed to send message.' });
    }
};
