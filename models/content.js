const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['article', 'video', 'course', 'picture'],
    required: true,
  },
  pictureUrl: [
    {
      type: String
    }
  ],
  videoUrl: [
    {
      type: String
    }
  ],
  articleUrl: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to a Course model for content that is part of a course
  },
  reports: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
  ],
  topic: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    }
  ],
  tags: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }
  ]
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
