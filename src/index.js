const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const multer = require('multer')
const upload = multer({
  dest: 'images/',
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a word document'))
    }
    cb(undefined, true)
  }
})

app.post('/upload', upload.single('upload'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  res.send()
})

app.listen(port, () => {
  console.log('App listening on port :', port)
})
