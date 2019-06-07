const express = require('express')
const User = require('../db/models/user')
const auth = require('../middleware/auth')
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

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).save()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).save()
  }
})

router.get('/users/me', auth, async (req, res) => {
  try {
    res.status(200).send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update request' })
  }

  try {
    const user = req.user

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
    console.log(e)
    res.status(500).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
