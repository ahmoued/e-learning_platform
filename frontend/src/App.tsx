//import { useState } from 'react'
//import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route} from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SignupPage from './pages/SignupPage';
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/courses" element={<CoursesPage/>}/>
      <Route path="/courses/:id" element={<CourseDetailPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/instructordashboard" element={<InstructorDashboard/>}/>

    </Routes>
  );
}

export default App
