import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StudentHomepage from './pages/StudentHomepage'
import ProfessorHomepage from './pages/ProfessorHomepage'



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/students/" element={<StudentHomepage />} />
      <Route path="/professors/" element={<ProfessorHomepage />} />

    </Routes>
  )
}
