import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 50,
      required: false,
    },
    path: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    product: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'File',
    timestamps: true,
  }
);

const File = mongoose.model('File', fileSchema);

export default File;
