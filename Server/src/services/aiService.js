import { uploadFileToAI, generateContentFromFile } from '../model/aiModel.js';

const processImageWithAI = async (file) => {
  try {
    console.log('Processing file:', file.path);

    // Upload file to prepare for AI processing
    const fileData = await uploadFileToAI(file.path, file.mimetype);

    // Generate content using the file data
    const aiResponse = await generateContentFromFile(fileData, file.mimetype);

    return {
      image: {
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
      },
      aiResponse,
    };
  } catch (error) {
    console.error('Error in processImageWithAI:', error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
};

export { processImageWithAI };
