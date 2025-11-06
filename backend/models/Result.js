import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
    unique: true,
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
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    default: null
  },
  winnerName: {
    type: String,
    default: ''
  },
  winnerDepartment: {
    type: String,
    default: ''
  },
  winnerYear: {
    type: String,
    default: ''
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  announced: {
    type: Boolean,
    default: false
  },
  announcedAt: {
    type: Date,
    default: null
  }
});

const Result = mongoose.model('Result', resultSchema);

export default Result;

