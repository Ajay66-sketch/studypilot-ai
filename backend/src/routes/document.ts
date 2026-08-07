import { Router } from 'express';
import {
  createDocumentController,
  getDocumentsController,
  getDocumentByIdController,
  updateDocumentController,
  deleteDocumentController,
  findCachedDocumentController,
} from '../controllers/document.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createDocumentController);
router.get('/', getDocumentsController);
router.get('/cache', findCachedDocumentController);
router.get('/:id', getDocumentByIdController);
router.put('/:id', updateDocumentController);
router.delete('/:id', deleteDocumentController);

export default router;
