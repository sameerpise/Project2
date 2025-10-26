import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentRegistrationForm from './components/Logins/StudentRegisterForm';
import LoginForm from './components/Logins/Login';

import ProtectedRoute from './components/Protectedroute/ProtectedRoute';
import AptiQuestion from './components/AptitudePortal/Aptitude/AptiQuestion';
import GD from './components/AptitudePortal/Aptitude/GD';
import MachineRound from './components/AptitudePortal/Aptitude/MachineRound';
import AdminPortal from "./components/AptitudePortal/Admin/AdminPortal";
import VirtualCodeEditor from "./components/AptitudePortal/Aptitude/VirtualCode";
import AptitudeInstructions from "./components/AptitudePortal/Aptitude/AptitudeInstruction";
import StudentList from "./components/AptitudePortal/Admin/Studentlist";
import QuestionManager from "./components/AptitudePortal/Admin/SetTest";
import ForgotPassword from "./components/Logins/ForgotPassword";
import RegistrationPage from "./components/Logins/Dummylogin";
import LandingPage from "./components/Landingpage";
import Error from "./components/AptitudePortal/Aptitude/Error";
import StudentDashboard from "./components/student/StudentDashboard";
import DummuDash from "./components/AptitudePortal/DummuDash";
import AptitudePortal from "./components/AptitudePortal/AptitudePortal";
import Dashboard from "./components/AptitudePortal/Dashboard";
import Kpicards from "./components/student/Kpicards";
import StudentProfile from "./components/student/StudentProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<StudentRegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Forget" element={<ForgotPassword />} />
        <Route path="/R" element={<RegistrationPage />} />
        <Route path="/L" element={<LandingPage />} />
        <Route path="error" element={<Error />} />
        <Route path="s" element={<StudentDashboard />} />
        {/* <Route path="/list" element={<StudentList />} /> */}
   <Route path="D" element={<DummuDash />} />
 {/* Student dashboard */}
        <Route
          path="student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          {/* Instruction route before aptitude */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="AptitudePortal" element={<AptitudePortal/>} />
          <Route path="KpiCards" element={<Kpicards/>} />
          <Route path="AptitudePortal/aptii" element={<AptitudeInstructions />} />
           <Route path="/student-profile/:id" element={<StudentProfile />} />
          {/* Actual aptitude rounds */}
          <Route path="apti" element={<AptiQuestion />} />
          <Route path="gd" element={<GD />} />
          <Route path="machine" element={<VirtualCodeEditor />} />
           <Route path="list" element={<StudentList />} />
           <Route path="set" element={<QuestionManager />} />
           

        </Route>

        {/* Admin portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPortal />
              {/* <QuestionManager /> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
