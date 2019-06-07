const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Not a valid email ', value)
      }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 7,
    validate (value) {
      if (value.includes('password')) {
        throw new Error('Your password is too simple')
      }
    }
  },
  age: {
    type: Number,
    min: 0,
    default: 0
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  return userObject
}

UserSchema.methods.generateAuthToken = async function () {
  let user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'thismysecret')
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// custom method to fetch credentails
UserSchema.statics.findbyCredentails = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }
  return user
}

// Pre save hooks to hash plain text password
UserSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

UserSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
