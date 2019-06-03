const express = require('express');
const Task = require('../db/models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        let record = await task.save();
        res.status(200).send(record);
    }
    catch(e) {
        res.status(500).send(e);
    }
})


router.get('/tasks', async (req, res) => {
    try {
        let tasks = await Task.find({});
        res.send(tasks);
    }
    catch(e) {
        res.status(500).send({error: 'Error while reading tasks'});
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if(!task) {
            res.send(404).send();
        }
        return res.send(task);
    }
    catch(e) {
        res.status(500).send({error: 'Error while reading task'});
    }
   
})

router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['completed', 'description'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
 
    if(!isValidOperation) {
        res.status(400).send({error: 'Invalid update request'})
    }

    try {
        let task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: false});
        if(!task) {
            res.send(404).send();
        }
        return res.send(task);
    }
    catch(e) {
        res.status(500).send({error: 'Error while reading task'});
    }
   
})


router.delete('/tasks/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task) {
            res.status(404).send();
        }
        else {
            res.status(200).send(task);
        }
    }
    catch(e) {
        console.log('error', e);
        res.status(500).send(e);
    }
 })

module.exports = router;