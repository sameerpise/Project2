const express = require('express');
const router = express.Router();
const Question = require('../Models/Question');

// GET 50 random questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 50 } }]); // fetch 50 random
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Add a new question
router.post("/add", async (req, res) => {
  try {
    const { question, options, answer, category, difficulty } = req.body;
    const newQuestion = new Question({ question, options, answer, category, difficulty });
    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully", newQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a question
router.put("/update/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Question updated", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a question
router.delete("/delete/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
