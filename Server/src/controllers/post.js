import Post from '../model/postSchema.js';

const getPosts = async (req, res) => {
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
    const { title, description, product, type, severity, status, resolution } =
      req.body;
    const userId = req.user._id;

    // Validate input

    if (
      !title ||
      !description ||
      !product ||
      !type ||
      !severity ||
      !status ||
      !resolution
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
      type,
      severity,
      status,
      resolution,
      createdBy: userId,
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

export default { getPosts, addPost };
