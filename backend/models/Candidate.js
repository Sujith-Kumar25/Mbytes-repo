import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide candidate name'],
    trim: true
  },
  post: {
    type: String,
    required: [true, 'Please provide post'],
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
  department: {
    type: String,
    required: [true, 'Please provide department'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Please provide year'],
    trim: true
  },
  manifesto: {
    type: String,
    required: [true, 'Please provide manifesto'],
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  votesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
candidateSchema.index({ post: 1 });

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;

