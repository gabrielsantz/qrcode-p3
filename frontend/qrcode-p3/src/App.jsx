import './index.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import { Home, TeacherHomepage, QrReaderPage, StudentHomepage, LoginPage, RegisterPage } from './pages';


export default function App() {
    return (
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Home/>} />

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<StudentHomepage />} />
        {<Route path="/student/qr-reader" element={<QrReaderPage />} />}
      </Route>


      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/professor" element={<TeacherHomepage />} />
      </Route>

    </Routes>
    );
}