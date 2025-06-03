import { processImageWithAI } from '../services/aiService.js';

const processImage = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No image file uploaded. Use 'image' as the field name.",
      });
    }

    console.log('Processing image:', req.file.originalname);

    // Process image with AI service
    const result = await processImageWithAI(req.file);

    // Return the AI response
    res.status(200).json({
      error: false,
      ...result,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    next(error);
  }
};

export default { processImage };
