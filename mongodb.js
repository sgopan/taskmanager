let mongodb = require('mongodb')
let { MongoClient } = mongodb

let connectionURL = 'mongodb://127.0.0.1:27017'
let databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (_error, client) => {
  let db = client.db(databaseName)
  // db.collection('users').findOne({_id: new ObjectID('5ceb651b2db89e15ce51636b')}, (error, user) => {
  //     if(error) {
  //         return console.log('Unable to read user'), error;
  //     }
  //     else {
  //         console.log(user);
  //     }
  // });

  // db.collection('users').find({age: 40}).count( (error, count) => {
  //     console.log(count);
  // })

  // db.collection('users').find({age: 40}).toArray( (error, users) => {
  //     console.log(users);
  // })

  // db.collection('tasks').find({completed: true}).toArray( (error, tasks) => {
  //     console.log(tasks);
  // })

  // db.collection('users').updateOne({
  //     _id: new ObjectID('5ceb7ac34b59baf65b5f975c')
  // }, {
  //     $set: {
  //         name: 'Twotoo'
  //     }
  // }).then((result) => {
  //     console.log(result);
  // }).catch((error) => {
  //     console.log('Error while update record ', error);
  // })

  // db.collection('users').updateOne({
  //     _id: new ObjectID('5ceb7ac34b59baf65b5f975c')
  // }, {
  //     $inc: {
  //         age: 10
  //     }
  // }).then((result) => {
  //     console.log(result);
  // }).catch((error) => {
  //     console.log('Error while update record ', error);
  // })

  // db.collection('users').updateMany({
  //   age: 40
  // }, {
  //   $set: {
  //     name: 'Jojo'
  //   }
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log('Error while update record ', error)
  // })

  // db.collection('tasks').deleteOne({
  //   description: 'task2'
  // }).then((result) => {
  //   console.log(result)
  // }).catch((e) => {
  //   console.log(e)
  // })

  // console.log(process.env.VAL1)
})
