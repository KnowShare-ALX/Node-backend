const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  moderators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true
    },
  ],
  forums: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Forum',
    },
  ],
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
