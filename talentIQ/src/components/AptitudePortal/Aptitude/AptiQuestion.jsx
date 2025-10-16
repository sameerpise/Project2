import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  LinearProgress,
  Button,
  Modal,
  Paper,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestions,
  setAnswer,
  nextQuestion,
  prevQuestion,
  decrementTimer,
  saveResult,
  resetQuiz,
  setCurrentQuestionDirectly,
} from "../../Redux/questionSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Loader Component
const FunnyLoader = () => (
  <Box
    sx={{
      height: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      fontSize: 48,
      color: "#6078ea",
      animation: "bounce 1s infinite",
      "@keyframes bounce": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-18px)" },
      },
    }}
  >
    🧑‍🎓💭📝
    <Typography variant="h6" sx={{ mt: 1, color: "#4f6fbf" }}>
      Loading Your Brain… I mean Test!
    </Typography>
  </Box>
);

// Tracker Component
const QuestionTracker = ({ questions, answers, currentQuestion, jumpToQuestion }) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid #e6eefc",
        borderRadius: 3,
        p: 2,
        background: "#ffffff",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Questions
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(5, 1fr)" },
          gap: 1,
        }}
      >
        {questions.map((_, idx) => {
          const ans = answers[idx];
          let bg = "#eef6ff"; // unattempted
          if (ans === "skipped") bg = "#fff3b0"; // yellow
          else if (ans) bg = "#c8e6c9"; // green
          if (idx === currentQuestion) bg = "#90caf9"; // blue
          return (
            <Tooltip key={idx} title={`Question ${idx + 1}`} arrow>
              <Button
                sx={{ bgcolor: bg, borderRadius: 1, minWidth: 40, minHeight: 40 }}
                onClick={() => jumpToQuestion(idx)}
              >
                {idx + 1}
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

// Timer Component
const TimerBar = ({ timer, currentQuestion, totalQuestions }) => {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>
        ⏱ Timer: {formatTime(timer)}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 12,
          borderRadius: 6,
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #89cfff 0%, #b9b0ff 100%)",
          },
        }}
      />
    </Box>
  );
};

// Question Card Component
const QuestionCard = ({
  q,
  userAnswer,
  handleSelect,
  showCorrect,
  handleNext,
  handlePrev,
  handleSkip,
  currentQuestion,
  totalQuestions,
}) => {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography variant="h6">
            Question {currentQuestion + 1} / {totalQuestions}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2, fontSize: 18 }}>{q.question}</Typography>
        <RadioGroup value={userAnswer || ""} onChange={(e) => handleSelect(e.target.value)}>
          {q.options.map((opt, i) => (
            <FormControlLabel
              key={i}
              value={opt}
              control={<Radio disabled={showCorrect} />}
              label={opt}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 2,
                border:
                  showCorrect && opt === q.answer
                    ? "2px solid #4caf50"
                    : showCorrect && userAnswer === opt && opt !== q.answer
                    ? "2px solid #ff6b6b"
                    : "1px solid #e6eefc",
                bgcolor:
                  showCorrect && opt === q.answer
                    ? "rgba(139, 233, 189, 0.12)"
                    : showCorrect && userAnswer === opt && opt !== q.answer
                    ? "rgba(255,107,107,0.08)"
                    : "#ffffff",
                transition: "all 0.18s ease",
                "&:hover": { bgcolor: "#f6f9ff" },
              }}
            />
          ))}
        </RadioGroup>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            mt: 3,
            gap: 1,
          }}
        >
          <Button onClick={handlePrev} disabled={currentQuestion === 0} variant="outlined">
            ⬅ Previous
          </Button>
          <Button onClick={handleSkip} variant="outlined">
            ⏭ Skip
          </Button>
          <Button onClick={handleNext} disabled={!userAnswer} variant="contained">
            {currentQuestion === totalQuestions - 1 ? "Finish" : "Next ➡"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Modal Manager Component
const ModalManager = ({ openModal, setOpenModal }) => {
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <Paper
        sx={{
          width: 360,
          p: 3,
          borderRadius: 3,
          mx: "auto",
          mt: "12%",
          textAlign: "center",
          boxShadow: 8,
          background: "#ffffff",
          border: "1px solid #eef6ff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: "#2e3a59" }}>
          🎉 Test Completed!
        </Typography>
        <Typography sx={{ color: "#6b7aa6", fontSize: "0.95rem" }}>
          Redirecting to Dashboard...
        </Typography>
      </Paper>
    </Modal>
  );
};

// Main Component
export default function AptitudePortal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector((state) => state.student.student);
  const { questions, answers, currentQuestion, timer, status } = useSelector(
    (state) => state.quiz
  );

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);

  // Fullscreen
  useEffect(() => {
    const enterFullScreen = async () => {
      const elem = document.documentElement;
      try {
        if (!document.fullscreenElement) await elem.requestFullscreen?.();
      } catch (err) {
        console.warn("Fullscreen failed:", err);
      }
    };
    enterFullScreen();
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.();
    };
  }, []);

  // Eligibility check
  useEffect(() => {
    if (!student?._id) return;
    const checkEligibility = async () => {
      try {
        const res = await fetch(
          `https://project2-bkuo.onrender.com/api/results/check/${student._id}`
        );
        const data = await res.json();
        if (!data.allowed) {
          alert("You have already submitted the test.");
          navigate("/student");
        } else {
          dispatch(resetQuiz());
          localStorage.setItem("aptiCompleted", "false");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkEligibility();
  }, [student, navigate, dispatch]);

  // Fetch questions
  useEffect(() => {
    if (status === "idle") dispatch(fetchQuestions()).finally(() => setLoading(false));
  }, [status, dispatch]);

  // Submit
  const handleFinish = useCallback(async () => {
    if (!student?._id) return alert("Student not logged in");
    const questionIds = questions.map((q) => q._id ?? q.id);
    const answersArray = questions.map((_, idx) => answers[idx] ?? "");
    try {
      await dispatch(
        saveResult({ studentId: student._id, questionIds, answers: answersArray })
      ).unwrap();
      localStorage.setItem("aptiCompleted", "true");
      window.dispatchEvent(new Event("storage"));
      setOpenModal(true);
      setTimeout(() => navigate("/student/AptitudePortal"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save result");
    }
  }, [answers, dispatch, navigate, questions, student]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer <= 0) handleFinish();
      else dispatch(decrementTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, dispatch, handleFinish]);

  // Anti-cheating
  useEffect(() => {
    const handleWarning = (msg = "Don't switch tabs or minimize!") => {
      if (warningCount < 3) {
        setSnackbarMsg(`⚠ Warning ${warningCount + 1}: ${msg}`);
        setOpenSnackbar(true);
        setWarningCount((prev) => prev + 1);
      } else {
        setSnackbarMsg("❌ Maximum warnings reached. Submitting test...");
        setOpenSnackbar(true);
        setTimeout(handleFinish, 1000);
      }
    };

    const handleVisibilityChange = () => document.hidden && handleWarning();
    const handleWindowBlur = () => handleWarning();
    const disableContextMenu = (e) => { e.preventDefault(); handleWarning("Right-click disabled"); };
    const disableCopy = (e) => { e.preventDefault(); handleWarning("Copy disabled"); };
    const disableKeyCombos = (e) => {
      if ((e.ctrlKey && ["c","x","u","p","s"].includes(e.key.toLowerCase())) || e.key === "PrintScreen") {
        e.preventDefault(); handleWarning("Shortcut keys disabled!");
      }
    };
    const disableSelection = () => document.getSelection()?.removeAllRanges();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("keydown", disableKeyCombos);
    document.addEventListener("selectstart", disableSelection);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
      document.removeEventListener("keydown", disableKeyCombos);
      document.removeEventListener("selectstart", disableSelection);
    };
  }, [warningCount, handleFinish]);

  if (loading || status === "loading") return <FunnyLoader />;
  if (status === "failed") return <Typography>Error loading questions</Typography>;
  if (!questions.length) return <Typography>No questions found</Typography>;

  const q = questions[currentQuestion];
  const userAnswer = answers[currentQuestion];
  const handleSelect = (value) =>
    dispatch(setAnswer({ questionIndex: currentQuestion, answer: value }));

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) dispatch(nextQuestion());
    else handleFinish();
  };
  const handlePrev = () => {
    if (currentQuestion > 0) dispatch(prevQuestion());
  };
  const handleSkip = () => {
    dispatch(setAnswer({ questionIndex: currentQuestion, answer: "skipped" }));
    handleNext();
  };
  const jumpToQuestion = (idx) => dispatch(setCurrentQuestionDirectly(idx));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        p: { xs: 2, md: 3 },
        background: "#f9fbff",
        minHeight: "90vh",
      }}
    >
      {/* Tracker */}
      <Box
        sx={{
          width: { xs: "100%", md: 320 },
          flexShrink: 0,
          mb: { xs: 2, md: 0 },
        }}
      >
        <QuestionTracker
          questions={questions}
          answers={answers}
          currentQuestion={currentQuestion}
          jumpToQuestion={jumpToQuestion}
        />
      </Box>

      {/* Questions */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        style={{ flex: 1 }}
      >
        <TimerBar
          timer={timer}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />
        <QuestionCard
          q={q}
          userAnswer={userAnswer}
          handleSelect={handleSelect}
          showCorrect={showCorrect}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleSkip={handleSkip}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />
      </motion.div>

      <ModalManager openModal={openModal} setOpenModal={setOpenModal} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning">{snackbarMsg}</Alert>
      </Snackbar>
    </Box>
  );
}
