import {
  uploadFileToAI,
  generateContentFromFile,
  generateResolutionEmail,
  testAiModel,
} from '../model/aiModel.js';

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

const processResolutionEmail = async (resInfo) => {
  try {
    console.log('Generating resolution email for:', resInfo.title);

    // Generate a professional email response for the bug resolution
    const emailContent = await generateResolutionEmail(resInfo);

    return {
      email: {
        subject: `Resolution for Bug: ${resInfo.title}`,
        body: emailContent,
      },
    };
  } catch (error) {
    console.error('Error in processResolutionEmail:', error);
    throw new Error(`Email generation failed: ${error.message}`);
  }
};

const processAiTest = async (question) => {
  try {
    console.log('Testing AI model...');

    // Test the AI model with a sample input
    const result = await testAiModel(question);

    return {
      testresponse: {
        message: 'AI model test successful',
        data: result,
      },
    };
  } catch (error) {
    console.error('Error in processAiTest:', error);
    throw new Error(`AI model test failed: ${error.message}`);
  }
};

export { processImageWithAI, processResolutionEmail, processAiTest };
