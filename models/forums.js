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
  author: {
    type: String,
    ref: 'User'
  },
  contributors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  members: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  ],
  moderators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
