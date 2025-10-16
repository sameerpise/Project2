import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch questions
export const fetchQuestions = createAsyncThunk(
  "quiz/fetchQuestions",
  async () => {
    const res = await fetch("https://project2-bkuo.onrender.com/api/questions");
    if (!res.ok) throw new Error("Failed to fetch questions");
    const data = await res.json();

    // ✅ Randomize options per student
    const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
    return data.map((q) => ({ ...q, options: shuffleArray([...q.options]) }));
  }
);

// Save results
export const saveResult = createAsyncThunk(
  "quiz/saveResult",
  async ({ studentId, questionIds, answers }, { rejectWithValue }) => {
    try {
      const res = await fetch("https://project2-bkuo.onrender.com/api/results/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, questionIds, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save result");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Save failed");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questions: [],
    answers: [],
    currentQuestion: 0,
    timer: 60 * 60,
    status: "idle",
    error: null,
  },
  reducers: {
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questions.length - 1)
        state.currentQuestion += 1;
    },
    prevQuestion: (state) => {
      if (state.currentQuestion > 0) state.currentQuestion -= 1;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) state.timer -= 1;
    },
    resetQuiz: (state) => {
      state.answers = [];
      state.currentQuestion = 0;
      state.timer = 60 * 60;
      state.status = "idle";
      state.error = null;
    },
    setCurrentQuestionDirectly: (state, action) => {
      const idx = action.payload;
      if (idx >= 0 && idx < state.questions.length) {
        state.currentQuestion = idx;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.questions = action.payload;
        state.answers = Array(action.payload.length).fill("");
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveResult.pending, (state) => {
        state.status = "saving";
        state.error = null;
      })
      .addCase(saveResult.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveResult.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setAnswer,
  nextQuestion,
  prevQuestion,
  decrementTimer,
  resetQuiz,
  setCurrentQuestionDirectly,
} = quizSlice.actions;

export default quizSlice.reducer;
