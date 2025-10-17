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
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StudentNotifications from "../AptitudePortal/Aptitude/StudentNotification";
import { logout } from "../Redux/studentslice";
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

const COLORS = ["#2e7d32", "#d32f2f", "#ed6c02"];

export default function StudentDashboard() {
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/student";
  const isTestStarted = location.pathname.includes("/student/apti");
  const TestIntructuion = location.pathname.includes("/student/AptitudePortal/aptii");

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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f8ff" }}>
      {/* ✅ Fullscreen Aptitude Test Mode */}
      {isTestStarted? (
        <Box sx={{ width: "100%", height: "100vh" }}>
          <Outlet />
        </Box>
      ) : (
        <>
          <SSidebar />
          <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ color: "#1565c0" }}>
               
              </Typography>
             <Card
  sx={{
    width: 320,
    borderRadius: 3,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    overflow: "hidden",
    bgcolor: "white",
  }}
>
  {/* Header */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      px: 2,
      py: 1.2,
      bgcolor: "#1976d2",
      color: "white",
    }}
  >
    <Typography variant="subtitle1" fontWeight="bold">
      Notifications
    </Typography>
    <Tooltip title="Close">
      <IconButton size="small" sx={{ color: "white" }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>

  {/* Body */}
  <Box sx={{ maxHeight: 280, overflowY: "auto", p: 1.5 }}>
    <StudentNotifications studentId={student._id} />
  </Box>
</Card>
            </Box>

            {/* Nested Routes */}
            {!isDashboardRoute && <Outlet />}

            {/* Dashboard Main */}
            {isDashboardRoute && (
              <>
                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
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
                        ? Math.round(
                            results.reduce((acc, r) => acc + getStats(r).score, 0) / results.length
                          )
                        : 0,
                      color: "#4caf50",
                      progress: results.length
                        ? Math.round(
                            results.reduce((acc, r) => acc + getStats(r).score, 0) / results.length
                          )
                        : 0,
                    },
                    {
                      title: "Retests Taken",
                      value: results.filter((r) => r.retestScore != null).length,
                      color: "#ff9800",
                      progress: results.length
                        ? Math.round(
                            (results.filter((r) => r.retestScore != null).length / results.length) * 100
                          )
                        : 0,
                    },
                  ].map((kpi, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <Card
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "scale(1.03)" },
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          {kpi.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          sx={{ color: kpi.color, mb: 2 }}
                        >
                          {kpi.value}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={kpi.progress}
                          sx={{
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
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 3, minHeight: 280 }}>
                      <Typography variant="subtitle1" mb={2} fontWeight="bold">
                        Performance Over Time
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                          <XAxis dataKey="test" />
                          <YAxis />
                          <RechartTooltip />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#1976d2"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 3, minHeight: 280 }}>
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
                              outerRadius={90}
                              data={[
                                {
                                  name: "Correct",
                                  value: getStats(results[results.length - 1]).correct,
                                },
                                {
                                  name: "Wrong",
                                  value: getStats(results[results.length - 1]).wrong,
                                },
                                {
                                  name: "Unanswered",
                                  value: getStats(results[results.length - 1]).unanswered,
                                },
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
                        sx={{
                          fontWeight: "bold",
                          minWidth: 140,
                          height: 60,
                          fontSize: "1rem",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    ))}
                  </Stack>
                </Card>

                {/* Recent Tests */}
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Recent Tests
                </Typography>
                <Grid container spacing={3}>
                  {results.slice(-4).map((r, idx) => {
                    const stats = getStats(r);
                    const retestStats = r.retestScore ? getStats(r, true) : null;
                    const testTitle = r.testName || `Test ${idx + 1}`;
                    return (
                      <React.Fragment key={idx}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.15)" },
                            }}
                            onClick={() => {
                              setSelectedTest(r);
                              setOpenModal(true);
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {testTitle}
                            </Typography>
                            <Typography color="green">
                              ✔ Correct: {stats.correct}
                            </Typography>
                            <Typography color="red">✖ Wrong: {stats.wrong}</Typography>
                            <Typography color="orange">
                              ⚪ Unanswered: {stats.unanswered}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              Score: {stats.score} ({stats.percentage}%)
                            </Typography>
                          </Card>
                        </Grid>

                        {retestStats && (
                          <Grid item xs={12} sm={6} md={3}>
                            <Card
                              sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: "#fff7e6",
                                cursor: "pointer",
                                "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.15)" },
                              }}
                              onClick={() => {
                                setSelectedTest(r);
                                setOpenModal(true);
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                color="#ff9800"
                              >
                                {testTitle} - Retest
                              </Typography>
                              <Typography color="green">
                                ✔ Correct: {retestStats.correct}
                              </Typography>
                              <Typography color="red">
                                ✖ Wrong: {retestStats.wrong}
                              </Typography>
                              <Typography color="orange">
                                ⚪ Unanswered: {retestStats.unanswered}
                              </Typography>
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

                {/* Export Button */}
                <Stack direction="row" spacing={2} mt={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportPDF}
                    sx={{ borderRadius: 2, px: 4, py: 1.2 }}
                  >
                    Export PDF
                  </Button>
                </Stack>

                {/* Test Detail Modal */}
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 450,
                      bgcolor: "background.paper",
                      p: 3,
                      borderRadius: 2,
                      boxShadow: 24,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedTest?.testName}
                      </Typography>
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
                        <Typography>
                          Unanswered: {getStats(selectedTest).unanswered}
                        </Typography>
                        <Typography>
                          Percentage: {getStats(selectedTest).percentage}%
                        </Typography>
                        {selectedTest.retestScore && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography>
                              Retest Score: {getStats(selectedTest, true).score}
                            </Typography>
                            <Typography>
                              Retest Percentage: {getStats(selectedTest, true).percentage}%
                            </Typography>
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
      )}
    </Box>
  );
}
