import express from 'express';
import post from '../../controllers/post.js';
import verifyJWT from '../../middleware/verifyJWT.js';

const router = express.Router();

router.get('/bug', post.getPosts);
router.post('/createpost', verifyJWT, post.addPost);
router.post('/resolution/:postId', verifyJWT, post.postResolution);
export default router;
