import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentId').optional().trim()
];

const loginValidation = [
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email'),
  body('studentId').optional({ checkFalsy: true }).trim(),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    if (!req.body.email && !req.body.studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or student ID'
      });
    }
    next();
  }
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

export default router;

