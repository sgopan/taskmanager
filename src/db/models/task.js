const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: true
  }
})

TaskSchema.pre('save', function (next) {
  next()
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
