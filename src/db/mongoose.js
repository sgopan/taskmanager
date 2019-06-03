const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    userFindAndModify: false
});

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true
//     },
//     age: {
//         type: Number,
//         validate(value) {
//             if(value < 0) {
//                 throw new Error('Age must be a positive');
//             }

//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         validate(value) {
//             if(!validator.isEmail(value)) {
//                 throw new Error('Invalid Email address');
//             }
//         },
//         trim: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         minlength: 7,
//         required: true,
//         trim: true,
//         validate(value) {
//             if(value.includes('password')) {
//                 throw new Error('Your password is too simple');
//             }
//         }
//     }

// })

// const me = new User({
//     name: 'ashwin12',
//     age: 23,
//     email: 'gopancd@gmail.com',
//     password: 'Godspeed#0'
// })

// me.save().then(() => {
//     console.log('user saved successfully', me);
// }).catch((err) => {
//     console.log(err);
// })

// const TaskModel = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new TaskModel({
//     description: 'Clean the toilet',

// })

// task.save()
//     .then(() => {
//         console.log('Created the task successfully', task);
//     })
//     .catch((err) => {
//         console.log('erro while creating the task', tasks);
//     })