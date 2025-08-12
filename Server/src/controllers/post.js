import Post from '../model/postSchema.js';
import User from '../model/userSchema.js';


const getPosts = async (req, res) => {
  console.log("get post fteching ....");
  try {
    const posts = await Post.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addPost = async (req, res) => {
  try {
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
    const username = req.user.username;

    console.log(req.body);
    // Validate input

    if (
      !title ||
      !description ||
      !product ||
      !type ||
      !severity ||
      !status ||
      !resolution ||
      !installation
    ) {
      return res
        .status(400)
        .json({ message: 'Title and content are required' });
    }

    // Create new post
    const newPost = new Post({
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

    // Save post to database
    await newPost.save();

    // Emit event to notify other users
    req.app.get('io').emit('newPost', newPost);

    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const postResolution = async (req, res) => {
  const { postId } = req.params;
  const { resolution } = req.body;

  try {
    console.log(req.body);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Set the resolution field
    post.resolution = resolution;
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const suggestedResolutions = async (req, res) => {
  const { postId } = req.params;
  const { suggestedResolutions } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add suggested resolutions
    post.suggestedResolutions.push(...suggestedResolutions);
    await post.save();
    // Emit event to notify other users
    req.app.get('io').emit('suggestedResolutions', {
      postId,
      suggestedResolutions: post.suggestedResolutions,
    });
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the user is the creator of the post
    if (post.createdBy !== req.user.username) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this post' });
    }
    await Post.findByIdAndDelete(postId);
    // Emit event to notify other users
    req.app.get('io').emit('postDeleted', postId);
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { getPosts, addPost, postResolution, deletePost };
