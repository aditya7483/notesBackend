const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('notes', noteSchema);