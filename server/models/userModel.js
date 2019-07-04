const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: Number,
  homeStop: {
    type: [String],
    required: true,
    index: true,
    default: undefined,
  },
  workStop: {
    type: [String],
    index: true,
    required: true,
    default: undefined,
  },
  timeToStation: {
    type: Number,
    default: 5,
  },
});

module.exports = mongoose.model('User', userSchema);
