const express = require('express')
const User = require('../db/models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    let token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findbyCredentails(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    if (!user) {
      res.status(404).send()
    } else {
      res.send({ user, token })
    }
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/users', async (req, res) => {
  try {
    let users = await User.find({})
    res.status(200).send(users)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/users/:id', async (req, res) => {
  let id = req.params.id
  console.log(id)
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).send()
    } else {
      console.log(user)
      return res.status(200).send(user)
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'Error while reading user' })
  }
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update request' })
  }

  try {
    const user = await User.findById(req.params.id)

    updates.forEach((update) => {
      user[update] = req.body[update]
    })

    await user.save()

    if (!user) {
      res.status(404).send()
    } else {
      res.status(200).send(user)
    }
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      res.status(404).send()
    } else {
      res.status(200).send(user)
    }
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
