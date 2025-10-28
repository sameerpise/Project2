import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Typography,
  Paper,
  Table,
  LoadingButton,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Tooltip,
  Avatar,
  Grid,
  Card,
  InputAdornment,
  CardContent
} from '@mui/material'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import autoTable from 'jspdf-autotable';
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import QuizIcon from '@mui/icons-material/Quiz'
import LogoutIcon from '@mui/icons-material/Logout'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SearchIcon from '@mui/icons-material/Search'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { saveAs } from 'file-saver'
import { useNavigate } from 'react-router-dom'
import QuestionManager from './SetTest'

// --- StudentList Component ---

import * as XLSX from 'xlsx'
export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [filterPassed, setFilterPassed] = useState("");
  const passingScore = 20;

  const fetchStudents = async () => {
    try {
      const res = await fetch("https://project2-f2lk.onrender.com/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch("https://project2-f2lk.onrender.com/api/results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStudents(), fetchResults()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const getStudentResult = (studentId) => {
    const studentResults = results.filter((r) => r.studentId?._id === studentId);
    if (!studentResults.length) return null;
    studentResults.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
    return studentResults[0];
  };

  const hasAppeared = (studentId) => !!getStudentResult(studentId);

  const filteredStudents = students.filter((s) => {
    const result = getStudentResult(s._id);
    const finalScore =
      result?.retestScore && result.retestScore > 0
        ? result.retestScore
        : result?.score ?? null;
    const passed = finalScore !== null && finalScore >= passingScore;
    const appeared = hasAppeared(s._id);

    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.mobile && s.mobile.includes(search));

    const matchesYear = filterYear ? s.whichYear === filterYear : true;
    const matchesDept = filterDepartment ? s.department === filterDepartment : true;
    const matchesCollege = filterCollege
      ? s.college?.toLowerCase().includes(filterCollege.toLowerCase())
      : true;

    const matchesPass =
      filterPassed === "passed" ? appeared && passed
      : filterPassed === "failed" ? appeared && !passed
      : true;

    return matchesSearch && matchesYear && matchesDept && matchesCollege && matchesPass;
  });

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))];
  const years = [...new Set(students.map((s) => s.whichYear).filter(Boolean))];

  const handleExportPDFS = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Students List", 14, 15);

    const headers = [[
      "Name","Email","Mobile","Department","College","Pursuing/Completed","Which Year","Test Status","Original Score","Retest Score","Result"
    ]];

    const rows = filteredStudents.map((s) => {
      const result = getStudentResult(s._id);
      const originalScore = result?.score ?? "—";
      const retestScore = result?.retestScore && result.retestScore > 0 ? result.retestScore : "—";
      const finalScore = retestScore !== "—" ? retestScore : originalScore;
      const passed = finalScore !== "—" && finalScore >= passingScore ? "Passed" : "Failed";
      const testStatus = hasAppeared(s._id) ? "Appeared" : "Not Appeared";

      return [
        s.fullName,
        s.email,
        s.mobile || "—",
        s.department || "—",
        s.college || "—",
        s.pursuingYear || "—",
        s.whichYear || "—",
        testStatus,
        originalScore,
        retestScore,
        hasAppeared(s._id) ? passed : "—"
      ];
    });

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: "grid",
      showHead: "everyPage",
      didDrawPage: (data) => {
        const page = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${page}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      }
    });

    doc.save("StudentsList.pdf");
  };

  return (
    <Box sx={{ p: 3, background: "linear-gradient(to top, #f7c86a, #ffffff)", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
        Students List
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search by name, email, or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200, bgcolor: "#fff", borderRadius: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
        />
        <TextField
          placeholder="Search by college"
          value={filterCollege}
          onChange={(e) => setFilterCollege(e.target.value)}
          sx={{ flex: 1, minWidth: 200, bgcolor: "#fff", borderRadius: 2 }}
        />
        <FormControl sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2 }}>
          <InputLabel>Which Year</InputLabel>
          <Select value={filterYear} label="Which Year" onChange={(e) => setFilterYear(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select value={filterDepartment} label="Department" onChange={(e) => setFilterDepartment(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {departments.map((dept) => (<MenuItem key={dept} value={dept}>{dept}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180, bgcolor: "#fff", borderRadius: 2 }}>
          <InputLabel>Result</InputLabel>
          <Select value={filterPassed} label="Result" onChange={(e) => setFilterPassed(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="passed">Only Passed</MenuItem>
            <MenuItem value="failed">Only Failed</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" sx={{ height: 50, minWidth: 180, fontWeight: "bold", fontSize: "0.95rem", borderRadius: 2, py: 1.5 }}
          onClick={handleExportPDFS}>Export to PDF</Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: "auto", boxShadow: 3, bgcolor: "#fff" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              {["Name","Email","Mobile","Department","College","Pursuing/Completed","Which Year","Test Status","Original Score","Retest Score","Result"].map((head) => (
                <TableCell key={head} sx={{ color: "#fff", fontWeight: "bold" }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow><TableCell colSpan={11} align="center">No students found</TableCell></TableRow>
            ) : (
              filteredStudents.map((student) => {
                const result = getStudentResult(student._id);
                const originalScore = result?.score ?? "—";
                const retestScore = result?.retestScore && result.retestScore > 0 ? result.retestScore : "—";
                const finalScore = retestScore !== "—" ? retestScore : originalScore;
                const passed = finalScore !== "—" && finalScore >= passingScore;
                return (
                  <TableRow key={student._id} hover>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.mobile || "—"}</TableCell>
                    <TableCell>{student.department || "—"}</TableCell>
                    <TableCell>{student.college || "—"}</TableCell>
                    <TableCell>{student.pursuingYear || "—"}</TableCell>
                    <TableCell>{student.whichYear || "—"}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: hasAppeared(student._id) ? "green" : "red" }}>
                      {hasAppeared(student._id) ? "Appeared" : "Not Appeared"}
                    </TableCell>
                    <TableCell>{originalScore}</TableCell>
                    <TableCell>{retestScore}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: passed ? "green" : "red" }}>
                      {hasAppeared(student._id) ? (passed ? "Passed" : "Failed") : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
