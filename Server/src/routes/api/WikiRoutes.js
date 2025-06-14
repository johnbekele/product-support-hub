import WikiDataTestController from '../../controllers/WikiDataTestController.js';
import { Router } from 'express';

const router = Router();

router.get('/mig-data/test', WikiDataTestController.getData);

export default router;
