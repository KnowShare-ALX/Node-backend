const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
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
  lectures: [
    {
        title: {
            type: String,
            unique: true,
            maxlength: 100,
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Content',
        },
    },
  ],
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  sections: [
    {
        title: {
            type: String,
            unique: true,
            maxlength: 100,
            required: true,
        },
        contents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Content',
                unique: true,
            },
        ],
    },
  ],
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
  paid: {
    type: Boolean,
    default: null,
    required: true,
  },
  cost: {
    type: Number,
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
