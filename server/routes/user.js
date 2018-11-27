const crypto = require('crypto')
const { User } = require('../models')

module.exports = {
  create,
  show,
  update,
}


const generateToken = () => {
  const length = 32
  const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789_-'
  const rnd = crypto.randomBytes(length)
  const ret = []
  for (let i = 0; i < length; i++) {
    ret.push(chars[rnd[i] % chars.length])
  }
  return ret.join('')
}

async function create(req, res) {
  const exist = await User.findOne({email: req.body.email})
  if (exist) return res.status(400).json({message: 'already exist'})
  if (!req.body.password) return res.status(400).json({message: 'invalid'})
  req.body.token = generateToken()
  const user = await User.create(req.body)
  res.json(user)
}

async function show(req, res) {
  const user = await User.findOne({_id: req.params.id})
  if (user === null) return res.status(404).json({message: 'not found'})
  res.json(user)
}

async function update(req, res) {
  let user = await User.findOne({_id: req.params.id})
  if (user === null) return res.status(404).json({message: 'not found'})
  user = await User.findByIdAndUpdate(user.id, {$set: req.body})
  res.json(user)
}