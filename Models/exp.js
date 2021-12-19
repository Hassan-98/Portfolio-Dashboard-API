const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    dateFrom: {
      type: String,
      required: true
    },
    dateTo: {
      type: String
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: Number,
      required: true,
      default: 0
    }
})

module.exports = mongoose.model('Exp', schema)
