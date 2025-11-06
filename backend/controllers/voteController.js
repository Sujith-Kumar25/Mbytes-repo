import Vote from '../models/Vote.js';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Submit vote
// @route   POST /api/votes
// @access  Private
export const submitVote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { candidateId } = req.body;
    const userId = req.user._id;

    // Get candidate to find post
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Check if user already voted for this post
    const existingVote = await Vote.findOne({
      user: userId,
      post: candidate.post
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this post'
      });
    }

    // Check if user has this post in votedPosts array
    if (req.user.votedPosts.includes(candidate.post)) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this post'
      });
    }

    // Create vote
    const vote = await Vote.create({
      user: userId,
      candidate: candidateId,
      post: candidate.post
    });

    // Update candidate vote count
    candidate.votesCount += 1;
    await candidate.save();

    // Update user's votedPosts array
    await User.findByIdAndUpdate(userId, {
      $push: { votedPosts: candidate.post }
    });

    res.status(201).json({
      success: true,
      message: 'Vote submitted successfully',
      data: vote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's votes
// @route   GET /api/votes/my-votes
// @access  Private
export const getMyVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ user: req.user._id })
      .populate('candidate', 'name post')
      .sort({ votedAt: -1 });

    res.json({
      success: true,
      count: votes.length,
      data: votes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all votes (Admin only)
// @route   GET /api/votes
// @access  Private/Admin
export const getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate('user', 'name email studentId')
      .populate('candidate', 'name post department')
      .sort({ votedAt: -1 });

    res.json({
      success: true,
      count: votes.length,
      data: votes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

