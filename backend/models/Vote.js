import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  post: {
    type: String,
    required: true,
    enum: [
      'President',
      'Vice President',
      'Secretary',
      'Joint Secretary',
      'Treasurer',
      'Event Organizer',
      'Sports Coordinator',
      'Media Coordinator'
    ]
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one vote per user per post
voteSchema.index({ user: 1, post: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;

