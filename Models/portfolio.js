const mongoose = require('mongoose')

const schema = mongoose.Schema({
    url: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    langs: {
      type: String,
      required: true
    },
    priority: {
      type: Number,
      required: true,
      default: 0
    },
    thumb: {
      type: String,
      required: true,
      trim: true
    },
    views: {
      type: Number,
      default: 1
    },
})

module.exports = mongoose.model('Project', schema)
