import {
  uploadFileToAI,
  generateContentFromFile,
  generateResolutionEmail,
  generateContentFromPDF,
  testAiModel,
} from '../model/aiModel.js';
import fs from 'fs';

import path from 'node:path';
import { fileURLToPath } from 'url';


const processImageWithAI = async (file) => {
  try {
    console.log('Processing file:', file.path);
  
    // tmp file from buffer 

    const tmpDIR="tmp"
    const tmpPath=path.join(tmpDIR,`${Date.now()} ${file.originalname} `)

    fs.writeFileSync(tmpPath,file.buffer);
    // Upload file to prepare for AI processing
    const fileData = await uploadFileToAI(tmpPath, file.mimetype);
    
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

const processPdf = async (file) => {
  try {
    console.log('Processing file:', file.path);

    // create templ file fomr buffer 

    const tmpDir="/tmp";
    const tmpPath=path.join(tmpDir,`${Date.now()}${file.originalname}`);

    //write buffer temp file 

    fs.writeFileSync(tmpPath,file.buffer);

    console.log('Temp file created ' , tmpPath);


    

    // Fix: Pass file path directly to generateContentFromPDF
    const aiResponse = await generateContentFromPDF(tmpPath);
        fs.unlinkSync(tmpPath);  // clean up temp file 
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

export { processImageWithAI, processResolutionEmail, processAiTest,processPdf };
