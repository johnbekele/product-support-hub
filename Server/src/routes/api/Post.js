import express from 'express';
import post from '../../controllers/post.js';
import verifyJWT from '../../middleware/verifyJWT.js';
import AiController from '../../controllers/AiController.cjs';

const router = express.Router();

router.get('/bug', post.getPosts);
router.post('/createpost', verifyJWT, post.addPost);
router.post('/resolution/:postId', verifyJWT, post.postResolution);
router.delete('/deletepost/:postId', verifyJWT, post.deletePost);



//Ai post controller 
router.post('/ai/querybug' ,AiController.queryVector)
router.post('/ai/createpost' ,AiController.feedVector)
export default router;
