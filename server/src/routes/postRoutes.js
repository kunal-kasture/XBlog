import express from 'express';
import {
  createPost,
  getPostById,
  updatePost,
  getAllPosts,
  deletePost,
  likePost,
} from '../controllers/postController.js';
import {
  addComment,
  getCommentsByPost,
} from '../controllers/commentController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getAllPosts)
  .post(protect, createPost);

router.post('/:id/like', protect, likePost);

router.route('/:id/comments')
  .get(optionalAuth, getCommentsByPost)
  .post(protect, addComment);

router.route('/:id')
  .get(optionalAuth, getPostById)
  .put(protect, updatePost)
  .post(protect, updatePost)
  .delete(protect, deletePost);

export default router;
