const jwt = require('jsonwebtoken')
const User = require('../db/models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    console.log(token)
    const data = jwt.verify(token, 'thismysecret')
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      throw new Error({ error: 'Invalid Authenticaiton' })
    }
    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(500).send({ error: 'Please authenticate' })
  }
}

module.exports = auth
