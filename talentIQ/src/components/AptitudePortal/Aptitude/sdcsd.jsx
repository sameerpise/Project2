import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  Stack,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Modal,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import StudentNotifications from "../AptitudePortal/Aptitude/StudentNotification";
import { logout } from "../redux/studentSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SSidebar from "./SSidebar";

const COLORS = ["#2e7d32", "#d32f2f", "#ed6c02"]; // Correct, Wrong, Unanswered

export default function StudentDashboard() {
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/student";
  const isTestStarted = location.pathname === "/dashboard/apti";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector((state) => state.student.student);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const badges = [
    { name: "Math Whiz", icon: "/badge1.png" },
    { name: "Logic Master", icon: "/badge2.png" },
    { name: "Quick Learner", icon: "/badge3.png" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const fetchResults = async () => {
    if (!student?._id) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/results");
      const data = await res.json();
      const studentResults = data.filter((r) => r.studentId?._id === student._id);
      setResults(studentResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [student]);

  const getStats = (res, useRetest = false) => {
    const answers = useRetest ? res.retestAnswers : res.answers;
    const score = useRetest ? res.retestScore : res.score;
    const total = answers?.length ?? 0;
    const unanswered = answers?.filter((a) => !a || a === "").length ?? 0;
    const attempted = total - unanswered;
    const correct = score ?? 0;
    const wrong = attempted - correct;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
    return { total, correct, wrong, unanswered, score: correct, percentage };
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Student Results", 14, 15);

    const headers = [["Test", "Score", "Retest Score", "Correct", "Wrong", "Unanswered", "Percentage"]];
    const rows = results.map((r) => {
      const s = getStats(r);
      const sRetest = r.retestScore
        ? getStats(r, true)
        : { score: "-", correct: "-", wrong: "-", unanswered: "-", percentage: "-" };
      return [r.testName, s.score, sRetest.score, s.correct, s.wrong, s.unanswered, s.percentage];
    });

    autoTable(doc, { head: headers, body: rows, startY: 25, styles: { fontSize: 8, cellPadding: 2 } });
    doc.save("StudentResults.pdf");
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading student results...</Typography>
      </Box>
    );

  const chartData = results.map((r, idx) => ({ test: r.testName || `Test ${idx + 1}`, score: getStats(r).score }));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar */}
    
      {
        ! isTestStarted &&  <SSidebar />
      }

      {/* Main Content */}
    {
      !isTestStarted &&(
        <>
          <Box sx={{ flex: 1, p: 3 }}>
        {/* Top Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <StudentNotifications studentId={student._id} />
        </Box>

        {/* Render nested routes only when not on dashboard */}
        {!isDashboardRoute && <Outlet />}

        {/* Render dashboard content only on /student/dashboard */}
        {isDashboardRoute && (
          <>
            {/* KPI Cards */}
{/* KPI Cards */}
<Grid container spacing={4} sx={{ mb: 4 }}>
  {[
    {
      title: "Total Tests",
      value: results.length,
      color: "#1976d2",
      progress: results.length ? 70 : 0,
    },
    {
      title: "Average Score",
      value: results.length
        ? Math.round(results.reduce((acc, r) => acc + getStats(r).score, 0) / results.length)
        : 0,
      color: "#4caf50",
      progress: results.length
        ? Math.round(results.reduce((acc, r) => acc + getStats(r).score, 0) / results.length)
        : 0,
    },
    {
      title: "Retests Taken",
      value: results.filter((r) => r.retestScore != null).length,
      color: "#ff9800",
      progress: results.length
        ? Math.round((results.filter((r) => r.retestScore != null).length / results.length) * 100)
        : 0,
    },
  ].map((kpi, i) => (
    <Grid
      item
      xs={12} // full width on mobile
      sm={6}  // 2 per row on small screens
      md={4}  // 3 per row on medium screens
      lg={3}  // 4 per row on large screens
      key={i}
    >
      <Card sx={{ p: 4, borderRadius: 4, minHeight: 140,width:250 }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {kpi.title}
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{ color: kpi.color, mb: 2 }}>
          {kpi.value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={kpi.progress}
          sx={{
            height: 20,
            borderRadius: 10,
            "& .MuiLinearProgress-bar": { bgcolor: kpi.color },
          }}
        />
      </Card>
    </Grid>
  ))}
</Grid>

{/* Charts */}
<Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} md={6}>
    <Card sx={{ p: 3, borderRadius: 3, minHeight: 280,width:500 }}>
      <Typography variant="subtitle1" mb={2} fontWeight="bold">
        Performance Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="test" />
          <YAxis />
          <RechartTooltip />
          <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  </Grid>

  <Grid item xs={12} md={6}>
    <Card sx={{ p: 3, borderRadius: 3, minHeight: 280 ,width:390}}>
      <Typography variant="subtitle1" mb={2} fontWeight="bold">
        Latest Test Breakdown
      </Typography>
      {results.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={90} // bigger radius
              data={[
                { name: "Correct", value: getStats(results[results.length - 1]).correct },
                { name: "Wrong", value: getStats(results[results.length - 1]).wrong },
                { name: "Unanswered", value: getStats(results[results.length - 1]).unanswered },
              ]}
            >
              {COLORS.map((color, i) => (
                <Cell key={i} fill={color} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography>No test data available</Typography>
      )}
    </Card>
  </Grid>
</Grid>

{/* Badges */}
<Card sx={{ mb: 4, p: 3 }}>
  <Typography variant="subtitle1" mb={2} fontWeight="bold">
    Achievements / Badges
  </Typography>
  <Stack direction="row" spacing={2} sx={{ overflowX: "auto", px: 1 }}>
    {badges.map((badge, i) => (
      <Chip
        key={i}
        label={badge.name}
        avatar={<Avatar src={badge.icon} />}
        sx={{ fontWeight: "bold", minWidth: 140, height: 60 }}
      />
    ))}
  </Stack>
</Card>

{/* Recent Tests */}
<Grid container spacing={3}>
  {results.slice(-4).map((r, idx) => {
    const stats = getStats(r);
    const retestStats = r.retestScore ? getStats(r, true) : null;
    const testTitle = r.testName || `Test ${idx + 1}`;
    return (
      <React.Fragment key={idx}>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Card
            sx={{ p: 4, borderRadius: 3, cursor: "pointer" }}
            onClick={() => {
              setSelectedTest(r);
              setOpenModal(true);
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {testTitle}
            </Typography>
            <Typography color="green">✔ Correct: {stats.correct}</Typography>
            <Typography color="red">✖ Wrong: {stats.wrong}</Typography>
            <Typography color="orange">⚪ Unanswered: {stats.unanswered}</Typography>
            <Typography variant="body1" fontWeight="bold">
              Score: {stats.score} ({stats.percentage}%)
            </Typography>
          </Card>
        </Grid>
        {retestStats && (
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Card
              sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff7e6", cursor: "pointer" }}
              onClick={() => {
                setSelectedTest(r);
                setOpenModal(true);
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" color="#ff9800">
                {testTitle} - Retest
              </Typography>
              <Typography color="green">✔ Correct: {retestStats.correct}</Typography>
              <Typography color="red">✖ Wrong: {retestStats.wrong}</Typography>
              <Typography color="orange">⚪ Unanswered: {retestStats.unanswered}</Typography>
              <Typography variant="body1" fontWeight="bold">
                Score: {retestStats.score} ({retestStats.percentage}%)
              </Typography>
            </Card>
          </Grid>
        )}
      </React.Fragment>
    );
  })}
</Grid>


            {/* Export PDF */}
            <Stack direction="row" spacing={2} mt={4}>
              <Button variant="contained" color="primary" onClick={handleExportPDF}>
                Export PDF
              </Button>
            </Stack>

            {/* Test Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">{selectedTest?.testName}</Typography>
                  <IconButton onClick={() => setOpenModal(false)}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {selectedTest && (
                  <>
                    <Typography>Total Questions: {selectedTest.answers.length}</Typography>
                    <Typography>Score: {getStats(selectedTest).score}</Typography>
                    <Typography>Correct: {getStats(selectedTest).correct}</Typography>
                    <Typography>Wrong: {getStats(selectedTest).wrong}</Typography>
                    <Typography>Unanswered: {getStats(selectedTest).unanswered}</Typography>
                    <Typography>Percentage: {getStats(selectedTest).percentage}%</Typography>
                    {selectedTest.retestScore && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography>Retest Score: {getStats(selectedTest, true).score}</Typography>
                        <Typography>Retest Percentage: {getStats(selectedTest, true).percentage}%</Typography>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Modal>
          </>
        )}
      </Box>
        
        </>
      )
    }
    </Box>
  );
}import React, { useEffect, useState, useCallback } from "react";
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
        width: 320,
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
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
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
      <Typography sx={{ mb: 1, fontWeight: 600 }}>⏱ Timer: {formatTime(timer)}</Typography>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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

  const testCompleted = localStorage.getItem("aptiCompleted") === "true";

  // Fullscreen
 useEffect(() => {
  const enterFullScreen = async () => {
    const elem = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        await elem.requestFullscreen?.();
      }
    } catch (err) {
      console.warn("Fullscreen failed:", err);
    }
  };
  enterFullScreen();

  return () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  };
}, []);


  // Eligibility check
  useEffect(() => {
    if (!student?._id) return;
    const checkEligibility = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/results/check/${student._id}`
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
      setTimeout(() => navigate("student/AptitudePortal"), 2000);
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
    <Box sx={{ display: "flex", gap: 2, p: 3, background: "#f9fbff", minHeight: "90vh" }}>
      {/* Left Tracker */}
      <QuestionTracker
        questions={questions}
        answers={answers}
        currentQuestion={currentQuestion}
        jumpToQuestion={jumpToQuestion}
      />

      {/* Right Questions */}
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

