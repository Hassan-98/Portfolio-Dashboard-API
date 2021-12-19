const mongoose = require('mongoose')

const schema = mongoose.Schema({
    cert: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: Number,
      required: true,
      default: 0
    },
    views: {
      type: Number,
      default: 1
    },
})

module.exports = mongoose.model('cert', schema)
