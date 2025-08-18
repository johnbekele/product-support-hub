import Content from '../model/contentModel.js';
import Wiki from "../model/wikiModel.js"
import mongoose from 'mongoose';


const getData = async (_, res) => {
  try {
    const wikiData = await Content.find();
    res.status(200).json(wikiData);
  } catch (error) {
    console.error('Error importing wiki data:', error);
    res
      .status(500)
      .json({ message: 'Failed to import wiki data.', error: error.message });
  }
};

const addWiki = async (req, res) => {
  const { title, resolution, found } = req.body;
  
  // Add input validation
  if (!title || !resolution || found === undefined) {
    return res.status(400).json({
      message: "Missing required fields: title, resolution, found"
    });
  }

  try {
    const titleExist = await Wiki.findOne({ title });
    if (titleExist) {
      console.log(`Resource already exists: ${titleExist.title}`);
      return res.status(409).json({ 
        message: "Resource already exists",
        existing: titleExist.title
      });
    }

    const result = await Wiki.create({ title, resolution, found });
    console.log(`Resource created successfully: ${result._id}`);
    
    return res.status(201).json({ 
      message: "Resource created successfully",
      data: result
    });
    
  } catch (error) {
    console.error('Wiki creation error:', error);
    return res.status(500).json({
      message: "Failed to create wiki entry",
      error: error.message
    });
  }
};

const getWikiTable=async(req, res)=>{
  try{
    const result=await Wiki.find();
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({message:"Faild to get wiki founding " , error:error.message});
  }
}

export default {
  addWiki,
  getData,
  getWikiTable
};



