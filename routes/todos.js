const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Assuming you have a Todo model

// ...existing code...

// Update a todo item
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
