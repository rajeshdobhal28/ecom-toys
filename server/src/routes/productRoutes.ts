import express from 'express';
import * as productController from '../controllers/productController';
import { optionalAuthenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/trending', optionalAuthenticate, productController.getTrendingProducts);
router.get('/', optionalAuthenticate, productController.getProducts);

export default router;
