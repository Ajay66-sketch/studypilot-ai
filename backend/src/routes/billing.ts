import { Router } from 'express';
import { verifyBillingController } from '../controllers/billing.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/verify', verifyBillingController);

export default router;
