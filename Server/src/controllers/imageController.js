import {
  processImageWithAI,
  processResolutionEmail,
  processPdf,
} from '../services/aiService.js';
import Post from '../model/postSchema.js';

import fs from 'fs';

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

const generateEmail = async (req, res) => {
  const { bugid } = req.params;
  try {
    //fetch bug data
    const post = await Post.findById(bugid);
    if (!post) {
      return res.status(404).json({
        error: true,
        message: 'Bug not found',
      });
    }
    if (!post.resolution) {
      return res.status(400).json({
        error: true,
        message: 'No resolution available for this bug',
      });
    }
    const postData = {
      title: post.title,
      description: post.description,
      resolution: post.resolution || '',
    };

    const result = await processResolutionEmail(postData);
    res.status(200).json({
      error: false,
      ...result,
      message: 'Email generated successfully',
    });
  } catch (error) {
    console.error('Error fetching bug data:', error);
    return res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
};


const processPdfCp = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No pdf file uploaded. Use 'pdf' as the field name.",
      });
    }

    console.log('Processing PDF:', req.file.originalname);

    const result = await processPdf(req.file);

    res.status(200).json({
      error: false,
      ...result,
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    next(error);
  }
};




export default { processImage, generateEmail,processPdfCp };
