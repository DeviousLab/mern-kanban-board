const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');

const boardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  icon: {
    type: String,
    default: '📃',
  },
  title: {
    type: String,
    default: 'Untitled',
  },
  description: {
    type: String,
    default: `Welcome!
    This is your board.
    Feel free to add a description.`,
  },
  position: {
    type: Number,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
  favouritePosition: {
    type: Number,
    default: 0,
  }
}, schemaOptions);

module.exports = mongoose.model('Board', boardSchema);