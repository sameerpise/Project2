import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    difficulty: "easy",
  });
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false); // <-- toggle state

  // Fetch questions
  const fetchQuestions = async () => {
    const res = await fetch("https://project2-f2lk.onrender.com/api/questions");
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const validateForm = () => {
    if (!form.question.trim()) return setError("Question text is required."), false;
    if (form.options.some((opt) => !opt.trim())) return setError("All options must be filled in."), false;
    if (!form.answer.trim()) return setError("Correct answer is required."), false;
    setError("");
    return true;
  };

  const handleAddOrUpdateQuestion = () => {
    if (!validateForm()) return;
    const newQuestions = [...questions];
    if (editIndex >= 0) { newQuestions[editIndex] = { ...form }; setEditIndex(-1); }
    else { newQuestions.push({ ...form }); }
    setQuestions(newQuestions);
    setForm({ question: "", options: ["", "", "", ""], answer: "", difficulty: "easy" });
  };

  const handleEdit = (index) => { setForm(questions[index]); setEditIndex(index); };
  const handleDelete = (index) => { setQuestions(questions.filter((_, i) => i !== index)); if(editIndex===index)setEditIndex(-1); };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; if(!file) return; setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      if(file.name.endsWith(".csv")) {
        const parsed = Papa.parse(data, { header:true, skipEmptyLines:true });
        processBulk(parsed.data);
      } else if(file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const workbook = XLSX.read(data, { type:"binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsed = XLSX.utils.sheet_to_json(sheet);
        processBulk(parsed);
      } else { setError("Unsupported file type. Upload CSV or Excel."); }
    };
    if(file.name.endsWith(".csv")) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  };

  const processBulk = (data) => {
    const formatted = [];
    for(let i=0;i<data.length;i++){
      const q=data[i];
      if(!q.question || !q.option1 || !q.option2 || !q.option3 || !q.option4 || !q.answer){
        setError(`Error in row ${i+2}: All fields are required.`); return;
      }
      formatted.push({question:q.question, options:[q.option1,q.option2,q.option3,q.option4], answer:q.answer, difficulty:q.difficulty || "easy"});
    }
    setQuestions([...questions, ...formatted]); setError("");
  };

  const handleSubmitAll = async () => {
    if(!questions.length) return setError("No questions to submit.");
    try {
      const res = await fetch("https://project2-f2lk.onrender.com/api/questions/bulk-add", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({questions})
      });
      const data = await res.json();
      alert(data.message); setQuestions([]); setFileName(""); fetchQuestions();
    } catch(err){ console.error(err); setError("Failed to submit questions."); }
  };

  return (
    <Box sx={{p:3, background:"linear-gradient(to top, #f7c86a, #ffffff)", minHeight:"100vh"}}>
      <Paper sx={{p:3, mb:4, borderRadius:3}} elevation={4}>
        <Typography variant="h6" sx={{mb:2, fontWeight:"bold"}}>Add / Edit Question (Manual)</Typography>
        <Divider sx={{mb:2}} />
        {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}

        <TextField fullWidth label="Question Text" value={form.question} onChange={(e)=>setForm({...form,question:e.target.value})} sx={{mb:2}} />

        <Grid container spacing={2}>
          {form.options.map((opt,i)=>(
            <Grid item xs={12} sm={6} key={i}>
              <TextField fullWidth label={`Option ${i+1}`} value={opt} onChange={(e)=>{
                const newOptions=[...form.options]; newOptions[i]=e.target.value;
                setForm({...form,options:newOptions});
                if(!newOptions.includes(form.answer)) setForm(prev=>({...prev,answer:""}));
              }} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{mt:2}}>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Correct Answer" value={form.answer} onChange={(e)=>setForm({...form,answer:e.target.value})}>
              {form.options.map((opt,i)=><MenuItem key={i} value={opt}>{opt || `Option ${i+1}`}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Difficulty" value={form.difficulty} onChange={(e)=>setForm({...form,difficulty:e.target.value})}>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Button variant="contained" sx={{mt:3, borderRadius:2, px:4}} onClick={handleAddOrUpdateQuestion}>
          {editIndex >= 0 ? "Update Question" : "Add Question"}
        </Button>
      </Paper>

      <Paper sx={{p:3, mb:4, borderRadius:3}} elevation={4}>
        <Typography variant="h6" sx={{mb:2, fontWeight:"bold"}}>Bulk Upload Questions (CSV/Excel/JSON)</Typography>
        <Divider sx={{mb:2}} />
        <Button variant="contained" component="label" sx={{mb:2}}>
          Upload File
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
        {fileName && <Typography sx={{mb:2}}>Selected File: {fileName}</Typography>}
      </Paper>

      {/* Toggle Preview */}
      {questions.length > 0 && (
        <Box sx={{mb:3}}>
          <Button variant="outlined" onClick={()=>setShowPreview(prev=>!prev)}>
            {showPreview ? "Hide Preview" : "Show Preview"} ({questions.length})
          </Button>
        </Box>
      )}

      {showPreview && questions.length > 0 && (
        <Paper sx={{p:3, borderRadius:3}} elevation={4}>
          <Typography variant="h6" sx={{mb:2, fontWeight:"bold"}}>Preview & Edit Questions</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((q,index)=>(
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{q.question}</TableCell>
                  <TableCell>{q.options.join(", ")}</TableCell>
                  <TableCell>{q.answer}</TableCell>
                  <TableCell>{q.difficulty}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={()=>handleEdit(index)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={()=>handleDelete(index)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="primary" sx={{mt:3}} onClick={handleSubmitAll}>Submit All Questions</Button>
        </Paper>
      )}
    </Box>
  );
}
