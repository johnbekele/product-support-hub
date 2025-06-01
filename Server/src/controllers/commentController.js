import Post from '../model/postSchema.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import User from '../model/userSchema.js';

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const username = req.user.username;

    if (!content || !postId) {
      return res
        .status(400)
        .json({ message: 'Content and post ID are required' });
    }
    // Validate if postId is a valid ObjectId
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: username,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    post.comment.push(newComment);
    await post.save();
    req.app.get('io').emit('newComment', { postId, comment: newComment });
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const username = req.user.username;

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }

    const post = await Post.findOne({ 'comment._id': commentId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment
    const comment = post.comment.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.user !== username) {
      return res
        .status(403)
        .json({ message: 'You can only delete your own comments' });
    }

    // Use pull instead of remove
    post.comment.pull({ _id: commentId });
    await post.save();

    req.app.get('io').emit('commentDeleted', { postId: post._id, commentId });
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createComment,
  deleteComment,
};
