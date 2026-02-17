import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/google', authController.googleLogin);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

// Placeholders for future use
router.post('/login', (req, res) => res.send('Login'));
router.post('/register', (req, res) => res.send('Register'));

export default router;
