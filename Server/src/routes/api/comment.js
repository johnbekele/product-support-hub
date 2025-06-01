import express from 'express';
import commentController from '../../controllers/commentController.js';
import verifyJWT from '../../middleware/verifyJWT.js';
const router = express.Router();

router.post('/:postId', verifyJWT, commentController.createComment);
router.delete('/:commentId', verifyJWT, commentController.deleteComment);

export default router;
