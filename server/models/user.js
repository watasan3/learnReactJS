const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const schema = new Schema({
  email: { type: String },
  password: { type: String },
  token: { type: String },
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, m) => {
      delete m.__v
      return m
    },
  },
})

schema.pre('update', async function(next) {
  this.options.runValidators = true
  return next()
})
schema.pre('findOneAndUpdate', async function(next) {
  this.options.runValidators = true
  this.options.new = true
  return next()
})

schema.plugin(mongooseLeanVirtuals)

module.exports = mongoose.model('User', schema)