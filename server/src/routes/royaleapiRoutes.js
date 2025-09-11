import { Router } from 'express';
import { getRoyaleapi } from '../controllers/royaleapiController.js';

const router = Router();

router.get('/api', getRoyaleapi);

export default router;
