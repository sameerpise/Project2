import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "./studentslice";
import quizReducer from "./questionSlice";
import notificationsReducer from './notificationslice';
export const store = configureStore({
  reducer: {
     notifications: notificationsReducer,
    student: studentReducer,
    quiz: quizReducer,
  },
});
