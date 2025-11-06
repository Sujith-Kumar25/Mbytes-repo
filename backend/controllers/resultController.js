import Result from '../models/Result.js';
import Candidate from '../models/Candidate.js';
import Vote from '../models/Vote.js';

// @desc    Get all results
// @route   GET /api/results
// @access  Public
export const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('winner', 'name department year manifesto photo')
      .sort({ post: 1 });

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get result for a specific post
// @route   GET /api/results/:post
// @access  Public
export const getResultByPost = async (req, res) => {
  try {
    const result = await Result.findOne({ post: req.params.post })
      .populate('winner', 'name department year manifesto photo');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found for this post'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get post statistics
// @route   GET /api/results/stats/:post
// @access  Private/Admin
export const getPostStats = async (req, res) => {
  try {
    const { post } = req.params;

    // Get all candidates for this post
    const candidates = await Candidate.find({ post }).sort({ votesCount: -1 });

    // Get total votes for this post
    const totalVotes = await Vote.countDocuments({ post });

    // Get result if announced
    const result = await Result.findOne({ post })
      .populate('winner', 'name department year manifesto photo');

    res.json({
      success: true,
      data: {
        post,
        totalVotes,
        candidatesCount: candidates.length,
        candidates,
        result: result || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Announce result for a post
// @route   POST /api/results/announce/:post
// @access  Private/Admin
export const announceResult = async (req, res) => {
  try {
    const { post } = req.params;

    // Get all candidates for this post
    const candidates = await Candidate.find({ post }).sort({ votesCount: -1 });

    if (candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No candidates found for this post'
      });
    }

    // Find winner (candidate with highest votes)
    const winner = candidates[0];

    // Check if there's a tie
    const topVotes = winner.votesCount;
    const winners = candidates.filter(c => c.votesCount === topVotes);

    if (winners.length > 1 && topVotes > 0) {
      return res.status(400).json({
        success: false,
        message: 'There is a tie. Cannot announce result automatically.',
        tiedCandidates: winners.map(w => ({
          id: w._id,
          name: w.name,
          votes: w.votesCount
        }))
      });
    }

    // Get total votes
    const totalVotes = await Vote.countDocuments({ post });

    // Create or update result
    let result = await Result.findOne({ post });

    if (result) {
      result.winner = winner._id;
      result.winnerName = winner.name;
      result.winnerDepartment = winner.department;
      result.winnerYear = winner.year;
      result.totalVotes = totalVotes;
      result.announced = true;
      result.announcedAt = new Date();
      await result.save();
    } else {
      result = await Result.create({
        post,
        winner: winner._id,
        winnerName: winner.name,
        winnerDepartment: winner.department,
        winnerYear: winner.year,
        totalVotes,
        announced: true,
        announcedAt: new Date()
      });
    }

    // Populate winner details
    await result.populate('winner', 'name department year manifesto photo');

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('resultAnnounced', {
        post,
        result: {
          post: result.post,
          winner: {
            name: result.winnerName,
            department: result.winnerDepartment,
            year: result.winnerYear,
            manifesto: result.winner?.manifesto || '',
            photo: result.winner?.photo || ''
          },
          totalVotes: result.totalVotes,
          announced: result.announced,
          announcedAt: result.announcedAt
        }
      });
    }

    res.json({
      success: true,
      message: `Result announced for ${post}`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all posts statistics
// @route   GET /api/results/stats/all
// @access  Private/Admin
export const getAllPostsStats = async (req, res) => {
  try {
    const posts = [
      'President',
      'Vice President',
      'Secretary',
      'Joint Secretary',
      'Treasurer',
      'Event Organizer',
      'Sports Coordinator',
      'Media Coordinator'
    ];

    const stats = await Promise.all(
      posts.map(async (post) => {
        const candidates = await Candidate.find({ post });
        const totalVotes = await Vote.countDocuments({ post });
        const result = await Result.findOne({ post })
          .populate('winner', 'name department year');

        return {
          post,
          totalVotes,
          candidatesCount: candidates.length,
          announced: result ? result.announced : false,
          winner: result && result.announced ? {
            name: result.winnerName,
            department: result.winnerDepartment,
            year: result.winnerYear
          } : null
        };
      })
    );

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

