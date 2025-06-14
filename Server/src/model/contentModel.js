import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    page_id: {
      type: Number,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    path: String,
    title: String,
    remoteUrl: String,
  },
  {
    collection: 'Content',
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
