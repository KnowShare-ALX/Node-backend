const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who is making the report
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType', // Reference to the reported content or user, with dynamic reference
  },
  targetType: {
    type: String,
    enum: ['Content', 'User'], // Define the possible types for reported items (content or user)
    required: true,
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500, // Define an appropriate maximum length for the report reason
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
