const express = require('express')
const Task = require('../db/models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    let record = await task.save()
    res.status(200).send(record)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = (req.query.completed === 'true')
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send({ error: 'Error while reading tasks', e })
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    let task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      res.send(404).send()
    }
    return res.send(task)
  } catch (e) {
    res.status(500).send({ error: 'Error while reading task' })
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const allowedUpdates = ['completed', 'description']
  const updates = Object.keys(req.body)
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid update request' })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    updates.forEach((update) => {
      task[update] = req.body[update]
    })

    task.save()

    if (!task) {
      res.send(404).send()
    }
    return res.send(task)
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'Error while reading task' })
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      res.status(404).send()
    } else {
      res.status(200).send(task)
    }
  } catch (e) {
    console.log('error', e)
    res.status(500).send(e)
  }
})

module.exports = router
