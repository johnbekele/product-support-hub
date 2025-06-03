import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import dotenv from 'dotenv';
import MOCK_BUGS from '../mokeData/data.js';

dotenv.config();

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
const mockData = JSON.stringify(MOCK_BUGS);

const uploadFileToAI = async (filePath, mimeType) => {
  return await ai.files.upload({
    file: filePath,
    config: { mimeType: mimeType },
  });
};
const generateContentFromFile = async (fileUri, mimeType) => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: createUserContent([
      createPartFromUri(fileUri, mimeType),
      `Use this ${mockData} data and respond with the resolution provided.`,
    ]),
  });

  return response.text;
};

export { uploadFileToAI, generateContentFromFile };
