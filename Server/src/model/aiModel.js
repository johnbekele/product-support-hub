import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
import MOCK_BUGS from '../mokeData/data.js';
import Post from './postSchema.js';
import mongoose from 'mongoose';

dotenv.config();

// Initialize Google GenAI client with the correct import
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const uploadFileToAI = async (filePath, mimeType) => {
  try {
    // Fetch data from DB
    const posts = await Post.find();
    if (!posts || posts.length === 0) {
      console.warn('No posts found in the database, using mock data');
      // If no data in DB, use mock data
      const bugData = JSON.stringify(MOCK_BUGS);

      // Read the file as binary data
      const fileData = fs.readFileSync(filePath);

      return {
        fileData: fileData,
        bugData: bugData,
        mimeType: mimeType,
      };
    }

    // Convert posts to a simpler format for the AI
    const formattedPosts = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      product: post.product,
      type: post.type,
      status: post.status,
      resolution: post.resolution || '',
    }));

    const bugData = JSON.stringify(formattedPosts);

    // Read the file as binary data
    const fileData = fs.readFileSync(filePath);

    return {
      fileData: fileData,
      bugData: bugData,
      mimeType: mimeType,
    };
  } catch (error) {
    console.error('Error reading file or fetching data:', error);
    throw new Error(`Failed to prepare data: ${error.message}`);
  }
};

const generateContentFromFile = async (fileData, mimeType) => {
  try {
    // Create a file part from the binary data
    const imagePart = {
      inlineData: {
        data: fileData.fileData.toString('base64'),
        mimeType: fileData.mimeType,
      },
    };

    // Create the prompt using the bugData from the fileData object
    const prompt = `Use this ${fileData.bugData} data and respond ONLY with a valid JSON array containing the id, title, description, product, type, status, and resolution of a bug found in the image. Do not include any explanatory text outside the JSON.`;

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [imagePart, { text: prompt }] }],
    });

    const response = result.response;
    console.log('Response received');

    // Get the text from the response
    const text = response.text();
    console.log('Raw response text length:', text.length);

    try {
      // Try to parse the text as JSON
      return JSON.parse(text);
    } catch (jsonError) {
      console.error('Failed to parse as JSON:', jsonError);

      // Try to extract JSON from the text
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        try {
          const jsonResponse = JSON.parse(jsonMatch[0]);
          console.log('Extracted JSON successfully');
          return jsonResponse;
        } catch (extractError) {
          console.error('Failed to parse extracted JSON:', extractError);
          return { rawText: text };
        }
      } else {
        // If we can't extract JSON, just return the text
        return { rawText: text };
      }
    }
  } catch (error) {
    console.error('Full error details:', error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
};

export { uploadFileToAI, generateContentFromFile };
