// migrateWikiToMongo.js

import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import Post from '../model/postSchema.js';

dotenv.config();

// Azure DevOps Config
const AZURE_ORG = 'tr-tax-default';
const AZURE_PROJECT = 'TAP UK Support'; // Raw name, encoded later
const WIKI_ID = 'TAP-UK-Support.wiki';
const AZURE_TOKEN = process.env.AZURE_PAT;

const AZURE_API_BASE = `https://dev.azure.com/${AZURE_ORG}/${encodeURIComponent(
  AZURE_PROJECT
)}/_apis/wiki/wikis/${WIKI_ID}`;
const headers = {
  Authorization: `Basic ${Buffer.from(':' + AZURE_TOKEN).toString('base64')}`,
};

// Fetch the full tree of pages (IDs, paths, URLs)
async function fetchAllWikiPages() {
  const url = `${AZURE_API_BASE}/pages?recursionLevel=full&api-version=7.0`;
  console.log(`📡 Fetching wiki pages from:\n${url}`);
  try {
    const res = await axios.get(url, { headers });
    return res.data.value || [];
  } catch (error) {
    console.error('❌ Failed to fetch wiki page list:', error.message);
    return [];
  }
}

// Fetch full content of a single page by ID
async function fetchPageContent(pageId) {
  const url = `${AZURE_API_BASE}/pages/${pageId}?includeContent=true&api-version=7.0`;
  try {
    const res = await axios.get(url, { headers });
    return res.data;
  } catch (error) {
    throw new Error(
      `Error fetching content for page ID ${pageId}: ${error.message}`
    );
  }
}

// Convert wiki content to Post schema
function mapToPostSchema(pageContent) {
  const now = new Date();
  return {
    title: pageContent.path?.split('/').pop().replace(/-/g, ' ') || 'Untitled',
    description: pageContent.content || '',
    installation: 'Unknown',
    product: 'Unknown',
    type: 'Wiki',
    severity: 'Medium',
    status: 'Imported',
    createdBy: 'aiimport',
    resolution: '',
    suggestedResolutions: [],
    comment: [],
    createdAt: now,
    updatedAt: now,
  };
}

// Main function to run the migration
async function runMigration() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const pages = await fetchAllWikiPages();
    console.log(`📄 Found ${pages.length} wiki page(s)`);

    if (!pages.length) {
      console.warn(
        '⚠️ No pages found. Check your Wiki ID, project name, or PAT permissions.'
      );
    }

    for (const page of pages) {
      try {
        const content = await fetchPageContent(page.id);
        const postDoc = mapToPostSchema(content);
        await Post.create(postDoc);
        console.log(`✅ Inserted: ${postDoc.title}`);
      } catch (err) {
        console.error(`❌ Failed page ${page.id}: ${err.message}`);
      }
    }

    console.log('🚀 Migration complete.');
  } catch (err) {
    console.error('🔥 Migration error:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

runMigration();
