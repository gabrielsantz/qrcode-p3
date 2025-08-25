import './index.css';
import { Routes, Route } from 'react-router-dom';


import { Home, ProfessorHomepage, QrReaderPage, StudentHomepage, LoginPage } from './pages';


export default function App() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/" element={<StudentHomepage />} />
        <Route path="/professor/" element={<ProfessorHomepage />} />
        <Route path="/student/qr-reader" element={<QrReaderPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
}