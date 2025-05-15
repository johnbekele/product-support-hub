import express from 'express';
import post from '../../controllers/post.js';

const router = express.Router();

router.get('/', post.getPosts);
router.post('/', post.addPost);

export default router;
