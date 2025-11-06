import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { exportResultsCSV, exportResultsPDF, exportVotesCSV } from '../utils/exportUtils.js';

const router = express.Router();

router.get('/results/csv', protect, adminOnly, async (req, res) => {
  try {
    await exportResultsCSV(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/results/pdf', protect, adminOnly, async (req, res) => {
  try {
    await exportResultsPDF(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/votes/csv', protect, adminOnly, async (req, res) => {
  try {
    await exportVotesCSV(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

