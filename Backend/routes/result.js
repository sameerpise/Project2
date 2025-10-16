// routes/results.js
const express = require("express");
const Result = require("../Models/result");
const Question = require("../Models/Question");
const Student = require("../Models/studentmodel"); // ✅ must be included
const Notification = require("../Models/notification");
const router = express.Router();

/**
 * Save result (only once unless admin resets)
 */
// Save result (with max 2 attempts)
// routes/results.js
// Save result (with max 2 attempts)
router.post("/save", async (req, res) => {
  try {
    const { studentId, questionIds, answers } = req.body;

    // Validate input
    if (!studentId || !Array.isArray(questionIds) || !Array.isArray(answers) || questionIds.length !== answers.length) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // ✅ Check max attempts
    if (student.testGiven && student.retestCount >= 2) {
      return res.status(403).json({ error: "Maximum test attempts reached. Contact admin." });
    }

    // Fetch correct answers
    const questions = await Question.find({ _id: { $in: questionIds } }).select("_id answer");
    const answerMap = {};
    questions.forEach((q) => (answerMap[q._id.toString()] = q.answer));

    // Evaluate
    let correctAnswers = 0, wrongAnswers = 0, notAnswered = 0;
    for (let i = 0; i < questionIds.length; i++) {
      const qid = questionIds[i].toString();
      const userAns = answers[i];
      if (!userAns || userAns === "") notAnswered++;
      else if (userAns === answerMap[qid]) correctAnswers++;
      else wrongAnswers++;
    }

    const score = correctAnswers;

    // ✅ Save result properly
    let result = await Result.findOne({ studentId });

    if (student.retestCount > 0 && result) {
      // 🔄 Retest update
      result = await Result.findOneAndUpdate(
        { studentId },
        { $set: { retestAnswers: answers, retestScore: score } },
        { new: true, runValidators: true }
      );
    } else {
      // 🆕 First attempt
      result = await Result.create({
        studentId,
        questionIds,
        answers,
        score,
        correctAnswers,
        wrongAnswers,
        notAnswered,
      });
    }

    // ✅ Update student status
    student.testGiven = true;
    await student.save();

    res.status(201).json({
      message: student.retestCount > 0 ? "Retest result saved successfully" : "Result saved successfully",
      result,
    });

  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ error: "Failed to save result" });
  }
});




/**
 * Check if student can give test
 */
router.get("/check/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ allowed: !student.testGiven });
  } catch (err) {
    console.error("❌ Error checking eligibility:", err);
    res.status(500).json({ error: "Failed to check eligibility" });
  }
});

/**
 * Get all results (for admin)
 */
router.get("/", async (req, res) => {
  try {
    const results = await Result.find()
      .populate("studentId", "fullName email mobile department college retestCount") // ✅ ensures admin portal can show student info
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

/**
 * Reset test for a student (allow re-test)
 */
// routes/results.js

router.post("/retest/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // ✅ Check max attempts
    if (student.retestCount >= 2) {
      return res.status(403).json({ error: "Student has reached maximum test attempts" });
    }

    // Delete previous results
    
   // await Result.deleteMany({ studentId });

    // Unlock student for re-test
    student.testGiven = false;
    student.retestCount += 1; // increment retest count
    await student.save();
  await Notification.create({
      userId: student._id,
      role: "student",
      message: "Your retest has been approved by the admin. You may attempt it now.",
      meta: { type: "retest" }
    });
    res.json({ message: "✅ Student can now give test again Notifiaction is send" });
  } catch (err) {
    console.error("❌ Error resetting result:", err);
    res.status(500).json({ error: "Failed to reset result" });
  }
});



module.exports = router; 