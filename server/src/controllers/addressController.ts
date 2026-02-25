import { Request, Response } from 'express';
import * as addressService from '../services/addressService';
import logger from '../utils/logger';

import { UserPayload } from '../middlewares/auth';

interface AuthRequest extends Request {
    user?: UserPayload;
}

export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }
        const addresses = await addressService.getAddresses(req.user.id);
        res.send({ status: 'success', data: addresses });
    } catch (err: any) {
        logger.error('Get addresses error', err);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }
        const addressData = { ...req.body, user_id: req.user.id };
        // Basic validation
        if (!addressData.address || !addressData.city || !addressData.state || !addressData.pincode || !addressData.phone_number) {
            res.status(400).send({ status: 'error', message: 'Missing required address fields' });
            return;
        }

        // Phone number validation: exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(String(addressData.phone_number))) {
            res.status(400).send({ status: 'error', message: 'Phone number must be exactly 10 digits' });
            return;
        }

        // Pincode validation: numbers only
        const pincodeRegex = /^\d+$/;
        if (!pincodeRegex.test(String(addressData.pincode))) {
            res.status(400).send({ status: 'error', message: 'Pincode must contain numbers only' });
            return;
        }

        const newAddress = await addressService.addAddress(addressData);
        res.status(201).send({ status: 'success', data: newAddress });
    } catch (err: any) {
        logger.error('Add address error', err);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }

        if (req.body.phone_number !== undefined) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(String(req.body.phone_number))) {
                res.status(400).send({ status: 'error', message: 'Phone number must be exactly 10 digits' });
                return;
            }
        }

        if (req.body.pincode !== undefined) {
            const pincodeRegex = /^\d+$/;
            if (!pincodeRegex.test(String(req.body.pincode))) {
                res.status(400).send({ status: 'error', message: 'Pincode must contain numbers only' });
                return;
            }
        }

        const id = req.params.id as string;
        const updated = await addressService.updateAddress(id, req.user.id, req.body);
        if (!updated) {
            res.status(404).send({ status: 'error', message: 'Address not found or no changes made' });
            return;
        }
        res.send({ status: 'success', data: updated });
    } catch (err: any) {
        logger.error('Update address error', err);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }
        const id = req.params.id as string;
        const success = await addressService.deleteAddress(id, req.user.id);
        if (!success) {
            res.status(404).send({ status: 'error', message: 'Address not found' });
            return;
        }
        res.send({ status: 'success', message: 'Address deleted' });
    } catch (err: any) {
        logger.error('Delete address error', err);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send({ status: 'error', message: 'User not authenticated' });
            return;
        }
        const id = req.params.id as string;
        const updated = await addressService.setDefaultAddress(id, req.user.id);
        res.send({ status: 'success', data: updated });
    } catch (err: any) {
        logger.error('Set default address error', err);
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
};
