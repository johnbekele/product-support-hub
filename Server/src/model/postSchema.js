import mongoose from 'mongoose';

// Define the schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    installation: {
      type: String,
      required: false,
    },
    product: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    severity: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
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
    suggestedResolutions: [],
    comment: [
      {
        user: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
        likes: {
          type: Number,
          default: 0,
        },
        timestamps: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    collection: 'Post',
    timestamps: true,
  }
);

// Create the model
const Post = mongoose.model('Post', postSchema);

export default Post;
