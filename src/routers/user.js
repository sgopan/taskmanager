const express = require('express')
const User = require('../db/models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../email/account')

const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    let token = await user.generateAuthToken()
    sendWelcomeEmail(user.email, user.name)
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

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
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
    sendCancellationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  const userid = req.params.id
  try {
    const user = await User.findById(userid)

    if (!user || !user.avatar) {
      res.status(404).send({ error: 'User not found!' })
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
