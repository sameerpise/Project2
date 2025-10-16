import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
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





  

// ...imports remain the same

// ...imports remain the same
// ...imports remain the same

export function StudentList() {
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
      const res = await fetch("https://project2-bkuo.onrender.com/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch("https://project2-bkuo.onrender.com/api/results");
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

// --- AdminPortal Component ---

export default function AdminPortal () {
  const [view, setView] = useState('dashboard')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [scoreRange, setScoreRange] = useState({ min: '', max: '' })
  const [openModal, setOpenModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [sortConfig, setSortConfig] = useState({
    key: 'student',
    direction: 'asc'
  })

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null') || {
    fullName: 'Admin',
    email: 'admin@example.com'
  }

  const fetchResults = async () => {
    try {
      const res = await fetch('https://project2-bkuo.onrender.com/api/results')
      if (!res.ok) throw new Error('Failed to fetch results')
      const data = await res.json()
      const uniqueResults = Object.values(
        data.reduce((acc, item) => {
          const id = item.studentId?._id ?? item.student?._id
          if (!id) return acc
          if (
            !acc[id] ||
            new Date(item.createdAt) > new Date(acc[id].createdAt)
          )
            acc[id] = item
          return acc
        }, {})
      )
      setResults(uniqueResults)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Inside your AdminPortal component:




const handleExportPDF = () => {
  const doc = new jsPDF({ orientation: "landscape" }); // landscape mode
  doc.setFontSize(16);
  doc.text("Student Results", 14, 15);

  const headers = [
    [
      "Name",
      "Email",
      "Department",
      "College",
      "Original Score",
      "Retest Score",
      "Original Total",
      "Retest Total",
      "Original Correct",
      "Retest Correct",
      "Original Wrong",
      "Retest Wrong",
      "Original Not Answered",
      "Retest Not Answered",
      "Original %",
      "Retest %"
    ]
  ];

  const rows = sortedResults.map(r => {
    const s = getStats(r);
    const sRetest = r.retestScore !== undefined ? getStats(r, true) : {
      score: "-",
      total: "-",
      correct: "-",
      wrong: "-",
      unanswered: "-",
      percentage: "-"
    };
    const student = r.studentId ?? r.student;
    return [
      student?.fullName ?? '',
      student?.email ?? '',
      student?.department ?? '',
      student?.college ?? '',
      s.score,
      sRetest.score,
      s.total,
      sRetest.total,
      s.correct,
      sRetest.correct,
      s.wrong,
      sRetest.wrong,
      s.unanswered,
      sRetest.unanswered,
      s.percentage,
      sRetest.percentage
    ];
  });

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 25,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",
    showHead: "everyPage",
    didDrawPage: (data) => {
      // Add page number
      const page = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${page}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save("StudentResults.pdf");
};





  useEffect(() => {
    fetchResults()
    const interval = setInterval(fetchResults, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleRetest = async studentId => {
    if (!window.confirm('Allow this student to retest?')) return
    try {
      const res = await fetch(
        `https://project2-bkuo.onrender.com/api/results/retest/${studentId}`,
        { method: 'POST' }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      alert(data.message)
      fetchResults()
    } catch (err) {
      alert(err.message || 'Failed to allow retest')
    }
  }

  const getStats = (res, useRetest = false) => {
    const answers = useRetest ? res.retestAnswers : res.answers
    const score = useRetest ? res.retestScore : res.score
    const total = answers?.length ?? 0
    const unanswered = answers?.filter(a => !a || a === '').length ?? 0
    const attempted = total - unanswered
    const correct = score ?? 0
    const wrong = attempted - correct
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0
    return { total, correct, wrong, unanswered, score: correct, percentage }
  }

  const filteredResults = results.filter(r => {
    const stats = getStats(r)
    const name = r.studentId?.fullName ?? r.student?.fullName ?? ''
    const inScoreRange =
      (scoreRange.min === '' || stats.score >= Number(scoreRange.min)) &&
      (scoreRange.max === '' || stats.score <= Number(scoreRange.max))
    return name.toLowerCase().includes(search.toLowerCase()) && inScoreRange
  })

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedResults = [...filteredResults].sort((a, b) => {
    const getValue = (r, key) => {
      const stats = getStats(r)
      switch (key) {
        case 'score':
          return stats.score
        case 'correct':
          return stats.correct
        case 'wrong':
          return stats.wrong
        case 'unanswered':
          return stats.unanswered
        case 'percentage':
          return Number(stats.percentage)
        default:
          return (
            r.studentId?.fullName ??
            r.student?.fullName ??
            ''
          ).toLowerCase()
      }
    }
    const valA = getValue(a, sortConfig.key)
    const valB = getValue(b, sortConfig.key)
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const paginatedResults = sortedResults.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  const topPerformers = sortedResults.filter(
    r => Number(getStats(r).percentage) >= 80
  )
  const handleChangePage = (e, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleExportCSV = () => {
    const headers = [
      'Student Name',
      'Email',

      'Department',
      'College',
      'Original Score',
      'Retest Score',
      'Original Total',
      'Retest Total',
      'Original Correct',
      'Retest Correct',
      'Original Wrong',
      'Retest Wrong',
      'Original Not Answered',
      'Retest Not Answered',
      'Original Percentage',
      'Retest Percentage'
    ]

    const rows = sortedResults.map(r => {
      const s = getStats(r)
      const sRetest =
        r.retestScore !== undefined
          ? getStats(r, true)
          : {
              score: '',
              total: '',
              correct: '',
              wrong: '',
              unanswered: '',
              percentage: ''
            }
      const student = r.studentId ?? r.student

      return [
        student?.fullName ?? '',
        student?.email ?? '',
        // student?.mobile ?? "",
        student?.department ?? '',
        student?.college ?? '',
        s.score,
        sRetest.score,
        s.total,
        sRetest.total,
        s.correct,
        sRetest.correct,
        s.wrong,
        sRetest.wrong,
        s.unanswered,
        sRetest.unanswered,
        s.percentage,
        sRetest.percentage
      ]
    })

    const csvContent = [headers, ...rows]
      .map(row =>
        row
          .map(cell => `"${cell}"`) // wrap each cell in quotes
          .join(',')
      )
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'results.csv')
  }

  const getScoreColor = score => {
    if (score <= 30) return '#d32f2f'
    if (score <= 70) return '#ed6c02'
    return '#2e7d32'
  }

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(to top, #f7c86a, #ffffff)'
      }}
    >
      {/* Sidebar */}
      <Paper
        sx={{ width: 220, m: 2, p: 2, borderRadius: 3, bgcolor: '#fff' }}
        elevation={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ mr: 1 }}>{user.fullName?.[0]}</Avatar>
          <Box>
            <Typography variant='subtitle1'>{user.fullName}</Typography>
            <Typography variant='caption'>{user.email}</Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant={view === 'dashboard' ? 'contained' : 'outlined'}
          sx={{ mb: 1 }}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </Button>
        <Button
          fullWidth
          variant={view === 'students' ? 'contained' : 'outlined'}
          sx={{ mb: 1 }}
          onClick={() => setView('students')}
        >
          Students
        </Button>
        <Button
          fullWidth
          variant={view === 'tests' ? 'contained' : 'outlined'}
          sx={{ mb: 1 }}
          onClick={() => setView('tests')}
        >
          Tests
        </Button>
        <Button
          fullWidth
          variant='contained'
          color='error'
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {view === 'dashboard' && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#1976d2', color: '#fff' }}>
                  <CardContent>
                    <Typography variant='subtitle1'>Total Students</Typography>
                    <Typography variant='h5'>{results.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#2e7d32', color: '#fff' }}>
                  <CardContent>
                    <Typography variant='subtitle1'>Top Performers</Typography>
                    <Typography variant='h5'>{topPerformers.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#ed6c02', color: '#fff' }}>
                  <CardContent>
                    <Typography variant='subtitle1'>Average Score</Typography>
                    <Typography variant='h5'>
                      {results.length > 0
                        ? Math.round(
                            results.reduce(
                              (acc, r) => acc + getStats(r).score,
                              0
                            ) / results.length
                          )
                        : 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: '#9c27b0', color: '#fff' }}>
                  <CardContent>
                    <Typography variant='subtitle1'>Total Retests</Typography>
                    <Typography variant='h5'>
                      {results.reduce(
                        (acc, r) =>
                          acc +
                          (r.studentId?.retestCount ??
                            r.student?.retestCount ??
                            0),
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <TextField
                label='Search by name'
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label='Min score'
                type='number'
                value={scoreRange.min}
                onChange={e =>
                  setScoreRange(s => ({ ...s, min: e.target.value }))
                }
                sx={{ width: 120 }}
              />
              <TextField
                label='Max score'
                type='number'
                value={scoreRange.max}
                onChange={e =>
                  setScoreRange(s => ({ ...s, max: e.target.value }))
                }
                sx={{ width: 120 }}
              />
              <Button
                variant='contained'
                color='success'
                startIcon={<SaveAltIcon />}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
              <Button
                variant='contained'
                color='primary'
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, overflowX: 'auto' }}
            >
              <Table size='small'>
                <TableHead sx={{ bgcolor: '#1976d2' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>Student</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                      Score
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                      Correct
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                      Wrong
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                      Not Answered
                    </TableCell>
                    <TableCell sx={{ color: '#fff', textAlign: 'center' }}>
                      Percentage
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>Retest Count</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align='center'>
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map(r => {
                      const s = getStats(r)
                      const sRetest =
                        r.retestScore !== undefined
                          ? getStats(r, true)
                          : {
                              score: '-',
                              total: '-',
                              correct: '-',
                              wrong: '-',
                              unanswered: '-',
                              percentage: '-'
                            }
                      const student = r.studentId ?? r.student
                      const maxAttemptsReached = student.retestCount >= 2

                      return (
                        <TableRow key={r._id}>
                          <TableCell>{student?.fullName}</TableCell>
                          <TableCell>{student?.email ?? '—'}</TableCell>

                          <TableCell>
                            <div>
                              Original:{' '}
                              <strong style={{ color: getScoreColor(s.score) }}>
                                {s.score}
                              </strong>
                            </div>
                            <div>
                              Retest:{' '}
                              <strong
                                style={{ color: getScoreColor(sRetest.score) }}
                              >
                                {sRetest.score}
                              </strong>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>Original: {s.total}</div>
                            <div>Retest: {sRetest.total}</div>
                          </TableCell>

                          <TableCell>
                            <div style={{ color: 'green', fontWeight: 'bold' }}>
                              Original: {s.correct}
                            </div>
                            <div style={{ color: 'green', fontWeight: 'bold' }}>
                              Retest: {sRetest.correct}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div style={{ color: 'red', fontWeight: 'bold' }}>
                              Original: {s.wrong}
                            </div>
                            <div style={{ color: 'red', fontWeight: 'bold' }}>
                              Retest: {sRetest.wrong}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div
                              style={{ color: 'orange', fontWeight: 'bold' }}
                            >
                              Original: {s.unanswered}
                            </div>
                            <div
                              style={{ color: 'orange', fontWeight: 'bold' }}
                            >
                              Retest: {sRetest.unanswered}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div style={{ color: 'blue', fontWeight: 'bold' }}>
                              Original: {s.percentage}%
                            </div>
                            <div style={{ color: 'blue', fontWeight: 'bold' }}>
                              Retest: {sRetest.percentage}%
                            </div>
                          </TableCell>

                          <TableCell>{student?.retestCount ?? 0}</TableCell>
                          <TableCell>
                            <Button
                              size='small'
                              onClick={() => {
                                setSelectedStudent(r)
                                setOpenModal(true)
                              }}
                            >
                              View
                            </Button>
                            <Tooltip
                              title={
                                maxAttemptsReached ? 'Max attempts reached' : ''
                              }
                              arrow
                            >
                              <span>
                                <Button
                                  size='small'
                                  color='warning'
                                  sx={{ ml: 1 }}
                                  onClick={() => handleRetest(student._id)}
                                  disabled={maxAttemptsReached}
                                >
                                  Re-test
                                </Button>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component='div'
              count={sortedResults.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}

        {view === 'students' && <StudentList results={results} />}
        {view === 'tests' && <QuestionManager />}

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Paper
            sx={{
              width: { xs: '90%', sm: 500 },
              p: 3,
              mx: 'auto',
              mt: '10%',
              borderRadius: 2
            }}
          >
            {selectedStudent && (
              <>
                <Typography variant='h6'>
                  {selectedStudent.studentId?.fullName ??
                    selectedStudent.student?.fullName}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>
                  Email: {selectedStudent.studentId?.email}
                </Typography>
                <Typography>
                  Mobile: {selectedStudent.studentId?.mobile}
                </Typography>
                <Typography>
                  Department: {selectedStudent.studentId?.department}
                </Typography>
                <Typography>
                  Year: {selectedStudent.studentId?.pursuingYear}
                </Typography>
                <Typography>
                  College: {selectedStudent.studentId?.college}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>
                  Total: {getStats(selectedStudent).total}
                </Typography>
                <Typography>
                  Correct: {getStats(selectedStudent).correct}
                </Typography>
                <Typography>
                  Wrong: {getStats(selectedStudent).wrong}
                </Typography>
                <Typography>
                  Not answered: {getStats(selectedStudent).unanswered}
                </Typography>
                <Typography>
                  Score:{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: getScoreColor(getStats(selectedStudent).score)
                    }}
                  >
                    {getStats(selectedStudent).score}
                  </span>
                </Typography>
              </>
            )}
          </Paper>
        </Modal>
      </Box>
    </Box>
  )
} 


