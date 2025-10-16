import { createSlice } from "@reduxjs/toolkit";

// Load existing student data from localStorage (if any)
const initialState = {
  student: JSON.parse(localStorage.getItem("student")) || null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    // Save student data to Redux + localStorage after login
    setStudent: (state, action) => {
      state.student = action.payload;
      localStorage.setItem("student", JSON.stringify(action.payload));
    },

    // Clear student data on logout
    logout: (state) => {
      state.student = null;
      localStorage.removeItem("student");
      localStorage.removeItem("token"); // optional: if you store a token separately
    },
  },
});

export const { setStudent, logout } = studentSlice.actions;
export default studentSlice.reducer;
