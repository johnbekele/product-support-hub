// AiController.cjs
const vectorDb = require("../config/vectorDb.cjs");
const mongoose = require("mongoose");


const feedVector = async (req, res) => {
  const { default: Post } = await import("../model/postSchema.js");
  
  const {
    title,
    installation,
    description,
    product,
    type,
    severity,
    status,
    resolution,
  } = req.body;
  const username = "testuser";

  const requiredFields = {
    title,
    installation,
    description,
    product,
    type,
    severity,
    status,
    resolution,
  };

  const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
  
  try {
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const kbentry = new Post({
      title,
      description,
      product,
      installation,
      type,
      severity,
      status,
      resolution,
      createdBy: username,
    });

    await kbentry.save();

    const vector = await vectorDb.getEmbedding(resolution);
    const index = await vectorDb.initPinecone();
    
    await index.upsert([{
      id: kbentry._id.toString(),
      values: vector,
      metadata: {
        product: product,
        installation: installation,
        title: title
      }
    }]);

    res.json({ success: true, kbentry });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const queryVector = async (req, res) => {
  try {
    const { default: Post } = await import("../model/postSchema.js");
    const { default: analyseVectorResponse } = await import("../model/aiModel.js");
    const { text, conversationHistory = [] } = req.body;
    
    const index = await vectorDb.initPinecone();
    const queryV = await vectorDb.getEmbedding(text);
    
    const result = await index.query({
      vector: queryV,
      topK: 5,
      includeMetadata: true
    });

    const ids = result.matches.map(m => m.id);

    const kbResults = await Post.find({
      _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
    });

    const payload = {
      vectoreData: JSON.stringify(kbResults),
      text: text,
      conversationHistory: conversationHistory
    };
    
    const respond = await analyseVectorResponse(payload);
    res.status(200).json(respond.rawText);
    
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ err: err.message });
  }
};


module.exports = { feedVector, queryVector };