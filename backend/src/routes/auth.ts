import { Router } from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  getMeController,
  updateOnboardingController,
} from '../controllers/auth.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshController);
router.get('/me', authenticate, getMeController);
router.post('/onboarding', authenticate, updateOnboardingController);

export default router;
