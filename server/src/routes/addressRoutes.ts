import express from 'express';
import { authenticate } from '../middlewares/auth';
import * as addressController from '../controllers/addressController';

const router = express.Router();

router.use(authenticate as any);

router.get('/', addressController.getAddresses as any);
router.post('/', addressController.addAddress as any);
router.put('/:id', addressController.updateAddress as any);
router.delete('/:id', addressController.deleteAddress as any);
router.put('/:id/default', addressController.setDefaultAddress as any);

export default router;
