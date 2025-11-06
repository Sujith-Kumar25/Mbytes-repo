import express from 'express';
import { body } from 'express-validator';
import {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate
} from '../controllers/candidateController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const candidateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('post').isIn([
    'President',
    'Vice President',
    'Secretary',
    'Joint Secretary',
    'Treasurer',
    'Event Organizer',
    'Sports Coordinator',
    'Media Coordinator'
  ]).withMessage('Invalid post'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('manifesto').trim().notEmpty().withMessage('Manifesto is required'),
  body('photo').optional().trim()
];

router.get('/', getCandidates);
router.get('/:id', getCandidate);
router.post('/', protect, adminOnly, candidateValidation, createCandidate);
router.put('/:id', protect, adminOnly, candidateValidation, updateCandidate);
router.delete('/:id', protect, adminOnly, deleteCandidate);

export default router;

