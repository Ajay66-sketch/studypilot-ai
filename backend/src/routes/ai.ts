import { Router } from 'express';
import {
  summaryController,
  modelAnswerController,
  questionsController,
  revisionController,
  getUsageController,
} from '../controllers/ai.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/summary', summaryController);
router.post('/model-answer', modelAnswerController);
router.post('/questions', questionsController);
router.post('/revision', revisionController);
router.get('/usage', getUsageController);

export default router;
