import mongoose from 'mongoose';

// Define the schema
const wikiSchema = new mongoose.Schema(
  {
    found:{
        type:Boolean,
    },
    title: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    resolution: {
      type: String,
      required: false,
    },
    decision: {
      type: String,
      required: false,
    },


   },
  {
    collection: 'Wiki',
    timestamps: true,
  }
);

// Create the model
const Wiki = mongoose.model('Wiki', wikiSchema);

export default Wiki;
