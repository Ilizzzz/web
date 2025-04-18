const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'document', 'presentation'],
    required: true
  },
  category: {
    type: String,
    enum: ['core', 'premium'],
    required: true
  },
  concept: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for efficient querying
resourceSchema.index({ title: 'text', description: 'text' });
resourceSchema.index({ type: 1, category: 1, concept: 1 });
resourceSchema.index({ averageRating: -1 });
resourceSchema.index({ downloadCount: -1 });
resourceSchema.index({ viewCount: -1 });

module.exports = mongoose.model('Resource', resourceSchema); 