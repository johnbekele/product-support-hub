import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
import MOCK_BUGS from '../mokeData/data.js';
import Post from './postSchema.js';
import mongoose from 'mongoose';
import cleanGeminiResponse from '../script/cleanGeminiResponse.js';

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
    //  file  from the binary data
    const imagePart = {
      inlineData: {
        data: fileData.fileData.toString('base64'),
        mimeType: fileData.mimeType,
      },
    };

    // prompt
    const prompt = `Use this ${fileData.bugData} data and respond ONLY with a valid JSON array containing the id, title, description, product, type, status, and resolution of a bug found in the image. Do not include any explanatory text outside the JSON.also please if you don't find the bug in the list responde with bug not found `;

    // response
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

const generateResolutionEmail = async (resInfo) => {
  const { title, description, resolution } = resInfo;
  const prompt = `Generate a professional email response for the following bug resolution using HTML:
<p>Thank you for contacting Digita Support.</p>
<p><strong>Title:</strong> ${title}</p>
<p><strong>Description:</strong> ${description}</p>
<p><strong>Resolution:</strong> ${resolution}</p>
<p>We appreciate your patience and understanding.</p>
Please write a clean email with a professional tone and focus on
 the problem resolution. Do not start with "Dear" or "Hello". The email should be concise and to the point. Ensure no indentation or unnecessary newline characters in the HTML format.`;

  try {
    if (!model) {
      throw new Error('Model is not initialized');
    }

    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      ),
    ]);

    const response = result.response;
    if (!response) {
      throw new Error('Empty response received from model');
    }

    let emailText = response.text();

    // Clean up the HTML response
    emailText = emailText

      .replace(/```html|```/g, '')

      .replace(/<\/?html>|<\/?body.*?>/gi, '')

      .replace(/\n/g, '')

      .replace(/\s{2,}/g, ' ')

      .replace(/style=".*?"/g, '')
      .replace(/\\/g, ' ')
      .replace(/""/g, '')
      .trim();

    const cleanedHtml = `<div style="font-family: Arial, sans-serif;">${emailText}</div>`;

    let subject = title || 'Resolution for your reported issue';

    return {
      subject: subject,
      body: cleanedHtml,
    };
  } catch (error) {
    console.error('Error generating resolution email:', error);
    return {
      subject: 'Error Resolution Information',
      body: `<div style="font-family: Arial, sans-serif;">
        <p>We apologize, but we encountered an error generating your email. The system reported: ${error.message}</p>
        <p>Please try again later or contact technical support if this issue persists.</p>
      </div>`,
    };
  }
};

export { uploadFileToAI, generateContentFromFile, generateResolutionEmail };
