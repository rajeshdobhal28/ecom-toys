import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

router.get('/trending', productController.getTrendingProducts);
router.get('/', productController.getProducts);

export default router;
