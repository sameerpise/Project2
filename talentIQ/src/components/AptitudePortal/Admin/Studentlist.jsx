import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Avatar,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";

export default function StudentList({ results = [] }) {
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // --- Keep logic same ---
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://project2-f2lk.onrender.com/api/results");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      const uniqueResults = Object.values(
        data.reduce((acc, item) => {
          const id = item.studentId?._id ?? item.student?._id;
          if (!id) return acc;
          if (!acc[id] || new Date(item.createdAt) > new Date(acc[id].createdAt))
            acc[id] = item;
          return acc;
        }, {})
      );
      setFiltered(uniqueResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const newFiltered = results.filter(
      (r) =>
        r.studentId?.fullName?.toLowerCase().includes(lowerSearch) ||
        r.student?.fullName?.toLowerCase().includes(lowerSearch)
    );
    setFiltered(newFiltered);
  }, [search, results]);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "linear-gradient(to bottom, #f5f7fa, #c3d9f8)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, color: "#1976d2" }} />
        <Typography variant="h5" fontWeight="bold">
          Student Management
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <TextField
          label="Search by name"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon color="primary" />,
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <Tooltip title="Refresh">
          <IconButton color="primary" onClick={fetchStudents}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Student Cards (for mobile) */}
      <Grid container spacing={2} sx={{ display: { xs: "flex", md: "none" } }}>
        {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => {
          const s = r.studentId ?? r.student;
          return (
            <Grid item xs={12} key={s?._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(240,240,255,0.9))",
                  backdropFilter: "blur(6px)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">{s?.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Score:</strong> {r.score}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Percentage:</strong>{" "}
                    {((r.score / (r.answers?.length || 1)) * 100).toFixed(2)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Student Table (for desktop) */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          display: { xs: "none", md: "block" },
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #1976d2, #42a5f5)" }}>
              {["Name", "Email", "Score", "Total", "Correct", "Wrong", "Unanswered", "Percentage"].map(
                (h) => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => {
                  const s = r.studentId ?? r.student;
                  const total = r.answers?.length ?? 0;
                  const correct = r.score ?? 0;
                  const wrong = total - correct;
                  const unanswered = r.answers?.filter((a) => !a)?.length ?? 0;
                  const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;

                  return (
                    <TableRow
                      key={r._id}
                      hover
                      sx={{
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: "#f1f8ff",
                        },
                      }}
                    >
                      <TableCell>{s?.fullName}</TableCell>
                      <TableCell>{s?.email}</TableCell>
                      <TableCell>{r.score}</TableCell>
                      <TableCell>{total}</TableCell>
                      <TableCell>{correct}</TableCell>
                      <TableCell>{wrong}</TableCell>
                      <TableCell>{unanswered}</TableCell>
                      <TableCell>{percentage}%</TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
}
