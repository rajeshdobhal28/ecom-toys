import express from 'express';
import { STATUS_CODES } from 'node:http';
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', (req, res) => {
    res.send('Register');
});

router.post('/login', (req, res) => {
    res.send('Login');
});

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { sub, email, name, picture } = payload;

        const jwtToken = jwt.sign({ email }, 'secret', { expiresIn: '1d' });

        console.log("jwtToken", jwtToken);

        res.cookie('secureToken', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.send({
            status: 'success',
            data: {
                ...payload,
                token
            }
        })
    } catch (err) {
        res.send({
            status: 'error',
            message: "Something went wrong"
        });
    }
});

// ... existing code ...
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.secureToken;
        if (!token) {
            res.status(401).send({ status: 'error', message: 'Not authenticated' });
            return;
        }

        const decoded = jwt.verify(token, 'secret');
        res.send({ status: 'success', data: decoded });
    } catch (err) {
        res.status(401).send({ status: 'error', message: 'Invalid token' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('secureToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.send({ status: 'success', message: 'Logged out' });
});

router.post('/google/redirect', (req, res) => {
    // ... existing code ...
    console.log("google/redirect", req.body);
    res.send('google/redirect');
})

export default router;