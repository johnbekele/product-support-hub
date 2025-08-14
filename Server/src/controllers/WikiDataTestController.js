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

const addWiki=async (req,res)=>{
  const {title , resolution , found}=req.body;
  try{
    const titleExist=await Wiki.findOne({title:title})
    if(titleExist){
      console.log(`Resorce alredy exist :${titleExist.title}`)
      return res.status(400).json({
        "Message":"Resource alredy existed " ,
        "decision":titleExist.title
      });
    }
    const result=await Wiki.create({title:title ,resolution:resolution , found:found})
   console.log(`resource created succesfully ${result}`)
   return res.status(200).json({"message":"resorce created " ,result})
  }catch(error){
    return res.status(500).json({message:"Faild to create wiki founding " , error:error.message});
  }
}

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



