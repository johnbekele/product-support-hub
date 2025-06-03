import { uploadFileToAI, generateContentFromFile } from '../model/aiModel.js';

const processImageWithAI = async (file) => {
  try {
    // Upload file to Google GenAI
    const uploadedFile = await uploadFileToAI(file.path, file.mimetype);

    // Generate content using the uploaded file
    const aiResponse = await generateContentFromFile(
      uploadedFile.uri,
      uploadedFile.mimeType
    );

    return {
      image: {
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
      },
      aiResponse,
    };
  } catch (error) {
    throw new Error(`AI processing failed: ${error.message}`);
  }
};

export { processImageWithAI };
