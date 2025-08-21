import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StudentHomepage from './pages/StudentHomepage'
import ProfessorHomepage from './pages/ProfessorHomepage'
import QrReaderPage from './pages/QrReader'



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student/" element={<StudentHomepage />} />
      <Route path="/professor/" element={<ProfessorHomepage />} />
      <Route path="/student/qr-reader" element={<QrReaderPage />} />


    </Routes>
  )
}
