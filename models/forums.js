const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  members: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
  ],
  moderators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      unique: true,
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
