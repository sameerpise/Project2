import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/studentSlice";
import { nextQuestion, prevQuestion } from "../Redux/questionSlice";

export default function Sidebar({ open = true }) {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student.student);
  const { questions, answers, currentQuestion } = useSelector(
    (state) => state.quiz
  );

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const getQuestionStatus = (index) => {
    const ans = answers[index];
    if (ans === undefined || ans === "") return "unanswered"; // red
    if (ans === "skipped") return "skipped"; // yellow
    return "answered"; // green
  };

  const jumpToQuestion = (index) => {
    const diff = index - currentQuestion;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) dispatch(nextQuestion());
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) dispatch(prevQuestion());
    }
  };

  return (
    <Box
      sx={{
        width: { xs: open ? "70%" : 0, sm: 260 },
        minWidth: { xs: 0, sm: 260 },
        height: "114vh",
        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: { xs: 0, sm: 3 },
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        overflowX: "hidden",
      }}
    >
      {/* Profile Section */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Avatar
          alt={student?.fullName || "Student"}
          src="/profile.png"
          sx={{
            width: { xs: 80, sm: 110 },
            height: { xs: 80, sm: 110 },
            mx: "auto",
            mb: 1.5,
            border: "4px solid rgba(255,255,255,0.8)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            transition: "all 0.3s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 14, sm: 16 },
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          {student?.fullName || "Student Name"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ opacity: 0.85, fontSize: { xs: 12, sm: 14 }, mb: 0.5 }}
        >
          {student?.email || "email@example.com"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ opacity: 0.8, fontSize: { xs: 12, sm: 14 } }}
        >
          🎓 {student?.college || "College Name"}
        </Typography>

        <Chip
          label="Active"
          sx={{
            mt: 1.5,
            bgcolor: "#00e676",
            color: "#fff",
            fontWeight: "bold",
            fontSize: { xs: 10, sm: 12 },
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        />

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 2 }} />
      </Box>

      {/* Question Tracker */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}
        >
          🧭 Question Tracker
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
            justifyItems: "center",
          }}
        >
          {questions.map((_, index) => {
            const status = getQuestionStatus(index);
            let bgColor = "#f0f0f0";
            if (status === "answered") bgColor = "#4caf50"; // green
            if (status === "unanswered") bgColor = "#f44336"; // red
            if (status === "skipped") bgColor = "#ffb300"; // yellow

            return (
              <Tooltip
                key={index}
                title={
                  status === "answered"
                    ? "Answered"
                    : status === "skipped"
                    ? "Skipped"
                    : "Unanswered"
                }
                placement="top"
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: bgColor,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 14,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    border:
                      currentQuestion === index
                        ? "2px solid #fff"
                        : "2px solid transparent",
                    transition: "0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 0 8px rgba(255,255,255,0.5)",
                    },
                  }}
                  onClick={() => jumpToQuestion(index)}
                >
                  {index + 1}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 2,
            fontSize: 12,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#4caf50",
                borderRadius: "2px",
              }}
            />
            Answered
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#f44336",
                borderRadius: "2px",
              }}
            />
            Unanswered
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#ffb300",
                borderRadius: "2px",
              }}
            />
            Skipped
          </Box>
        </Box>
      </Box>

      {/* Logout Section */}
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            py: { xs: 0.8, sm: 1.3 },
            borderRadius: 3,
            fontWeight: "bold",
            fontSize: { xs: 13, sm: 14 },
            bgcolor: "#ff4b5c",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            "&:hover": {
              bgcolor: "#ff2e44",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            },
            transition: "all 0.3s ease",
          }}
          fullWidth
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
}
