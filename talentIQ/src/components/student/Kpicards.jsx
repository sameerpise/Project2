import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
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
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
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
import StudentNotifications from "../AptitudePortal/Aptitude/StudentNotification";

const COLORS = ["#4caf50", "#f44336", "#ffa726"];

export default function Kpicards() {
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

  const fetchResults = async () => {
    if (!student?._id) return;
    setLoading(true);
    try {
      const res = await fetch("https://project2-bkuo.onrender.com/api/results");
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

  const chartData = results.map((r, idx) => ({
    test: r.testName || `Test ${idx + 1}`,
    score: getStats(r).score,
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      {/* Top Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Student Dashboard
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Welcome back, {student?.name || "Student"} 👋
          </Typography>
        </Box>

        <Box>
          <StudentNotifications studentId={student._id} />
        </Box>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: "Total Tests", value: results.length, color: "#0288d1" },
          {
            title: "Average Score",
            value: results.length
              ? Math.round(results.reduce((acc, r) => acc + getStats(r).score, 0) / results.length)
              : 0,
            color: "#43a047",
          },
          {
            title: "Retests Taken",
            value: results.filter((r) => r.retestScore != null).length,
            color: "#ff9800",
          },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                },
                background: `linear-gradient(145deg, ${kpi.color}15, #ffffff)`,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {kpi.title}
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: kpi.color }}>
                {kpi.value}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(kpi.value, 100)}
                sx={{
                  mt: 2,
                  height: 10,
                  borderRadius: 5,
                  "& .MuiLinearProgress-bar": { bgcolor: kpi.color },
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              Performance Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="test" />
                <YAxis />
                <RechartTooltip />
                <Line type="monotone" dataKey="score" stroke="#0288d1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
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
                    outerRadius={80}
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
          </Paper>
        </Grid>
      </Grid>

      {/* Badges */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" mb={2} fontWeight="bold">
          Achievements
        </Typography>
        <Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
          {badges.map((badge, i) => (
            <Chip
              key={i}
              label={badge.name}
              avatar={<Avatar src={badge.icon} />}
              sx={{
                fontWeight: "bold",
                minWidth: 130,
                height: 48,
                background: "#f1f8e9",
              }}
            />
          ))}
        </Stack>
      </Card>

      {/* Recent Tests */}
      <Grid container spacing={3}>
        {results.slice(-4).map((r, idx) => {
          const stats = getStats(r);
          const testTitle = r.testName || `Test ${idx + 1}`;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                onClick={() => {
                  setSelectedTest(r);
                  setOpenModal(true);
                }}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  },
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
          );
        })}
      </Grid>

      {/* Export PDF Button */}
      <Box textAlign="center" mt={4}>
        <Button variant="contained" onClick={handleExportPDF}>
          Download Results as PDF
        </Button>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 3,
            boxShadow: 24,
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={2}>
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
            </>
          )}
        </Box>
      </Modal>

      <Outlet />
    </Box>
  );
}
