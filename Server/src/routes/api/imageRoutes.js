import express from 'express';
import imageController from '../../controllers/imageController.js';
import { uploadToDisk, uploadToMemory } from '../../config/multerConfig.js';
import worker from '../../middleware/Worker.js';

const router = express.Router();

// Image processing route
router.post(
  '/process-image',
  uploadToDisk.single('image'),
  imageController.processImage
);

router.post('/image-ocr', uploadToMemory.single('image'), worker);

// Email generation route
router.post('/generate-email/:bugid', imageController.generateEmail);

export default router;
