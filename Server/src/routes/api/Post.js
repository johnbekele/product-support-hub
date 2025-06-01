import express from 'express';
import post from '../../controllers/post.js';
import verifyJWT from '../../middleware/verifyJWT.js';

const router = express.Router();

router.get('/bug', post.getPosts);
router.post('/createpost', verifyJWT, post.addPost);

export default router;
