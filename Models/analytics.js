const mongoose = require('mongoose')

const schema = mongoose.Schema({
    ipv4: {
      type: String,
      trim: true,
      unique: true
    },
    region: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    visits: [Date]
})

module.exports = mongoose.model('analytic', schema)
