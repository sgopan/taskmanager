const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

console.log(path.join(__dirname, 'public'))

app.listen(port, () => {
  console.log('App listening on port :', port)
})

const pet = {
  name: 'Gopan'
}

pet.toJSON = function () {
  console.log('toJSON ......')
  return this
}

JSON.stringify(pet)
