import express from 'express';
import imageController from '../../controllers/imageController.js';
import { uploadToDisk } from '../../config/multerConfig.js';

const router = express.Router();

// Image processing route
router.post(
  '/process-image',
  uploadToDisk.single('image'),
  imageController.processImage
);

export default router;
