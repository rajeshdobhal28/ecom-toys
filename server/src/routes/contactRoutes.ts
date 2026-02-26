import express from 'express';
import { submitContactForm } from '../controllers/contactController';

const router = express.Router();

// POST /api/contact
router.post('/', submitContactForm);

export default router;
