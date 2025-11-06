import express from 'express';
import { body } from 'express-validator';
import {
  submitVote,
  getMyVotes,
  getAllVotes
} from '../controllers/voteController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const voteValidation = [
  body('candidateId').notEmpty().withMessage('Candidate ID is required')
];

router.post('/', protect, voteValidation, submitVote);
router.get('/my-votes', protect, getMyVotes);
router.get('/', protect, adminOnly, getAllVotes);

export default router;

