const mongoose = require('mongoose');

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
    firstName: {
        type: String,
        maxlength: 50,
        required: true,
    },
    lastName: { 
        type: String,
        maxlength: 50,
        required: true
     },
    biography: {
        type: String,
        maxlength: 300
    },
    joinedDate: {
        type: Date,
        default:Date.now,
    },
    dateOfBirth: {
        type: Date,
        default: null,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    location: {
      country: {
        type: String,
        maxlength: 50,
        required: true,
      },
      state: {
        type: String,
        maxlength: 50,
        required: true,
      },
      city: {
        type: String,
        maxlength: 50,
      },
    },
    profilePicture: {
      type: String,
    },
    credentials: [
      {
        type: String,
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    topicsFollowing: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
      },
    ],
    blackList: {
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        }
      ],
      topics: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Topic'
        }
      ]
    },
    forums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Forum'
      },
    ],
    subscribers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Subscription',
      },
    ]
  });

const User = mongoose.model('User', userSchema);

module.exports = User;