import express from 'express';
import {
  getResults,
  getResultByPost,
  getPostStats,
  announceResult,
  getAllPostsStats
} from '../controllers/resultController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getResults);
router.get('/stats/all', protect, adminOnly, getAllPostsStats);
router.get('/stats/:post', protect, adminOnly, getPostStats);
router.get('/:post', getResultByPost);
router.post('/announce/:post', protect, adminOnly, announceResult);

export default router;

