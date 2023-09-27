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
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  lectures: [
    {
        title: {
            type: String,
            maxlength: 100,
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Content',
        },
    },
  ],
  requirements: {
    type: String
  },
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
            maxlength: 100,
            required: true,
        },
        contents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Content',
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

courseSchema.methods.like = function(userId) {
  const alreadyLiked = this.likes.some((like) => like.author.equals(userId));

  if (!alreadyLiked) {
    this.likes.push({ author: userId });
    return this.save();
  } else {
    return Promise.resolve('User has already liked this course.');
  }
}

courseSchema.pre('save', function(next) {
  const sections = this.sections;
  sections.forEach((section) => {
    const uniqueContents = [...new Set(section.contents)]; // Remove duplicates
    section.contents = uniqueContents;
  });
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
