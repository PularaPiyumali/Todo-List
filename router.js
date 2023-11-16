const express = require('express');
const router = express.Router();
const Todo = require('./model/todoList');

router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});


router.patch('/todos/:id', async (req, res) => {
  try {
    const existingTodo = await Todo.findById(req.params.id);
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    existingTodo.title = req.body.title;
    existingTodo.completed = req.body.completed;

    if (req.body.completed) {
      existingTodo.completedAt = new Date();
    } else {
      existingTodo.completedAt = null; 
    }

    const updatedTodo = await existingTodo.save();

    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

  


router.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
