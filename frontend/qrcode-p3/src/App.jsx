import './index.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import { Home, ClassesPage, TeacherHomepage, QrReaderPage, StudentHomepage, LoginPage, RegisterPage, QrGenerator, AttendanceHistory, ReportGeneration, Reports, PastReport, AdminHomepage, UserManagementPage, AllReportsPage, CheckDataPage, EnrollmentPage } from './pages';


export default function App() {
    return (
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Home/>} />


      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<StudentHomepage />} />
        {<Route path="/student/qr-reader" element={<QrReaderPage />} />}
        {<Route path="/student/attendance" element={<AttendanceHistory />} />}
        {<Route path="/student/enrollments" element={<EnrollmentPage />} />}
      </Route>


      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/professor" element={<TeacherHomepage />} />
        <Route path="/professor/qr-code/:classSessionId" element={<QrGenerator />} />
        <Route path="/professor/qr-code/report-generation/:classSessionId" element={<ReportGeneration />} />
        <Route path="/professor/reports" element={<Reports />} />
        <Route path="/professor/reports/past-report/:reportId" element={<PastReport />} />
        <Route path="/professor/classes" element={<ClassesPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminHomepage />} />
        <Route path="/admin/user-management" element={<UserManagementPage />} />
        <Route path="/admin/all-reports" element={<AllReportsPage />} />
        <Route path="/admin/all-reports/check-data/:reportId" element={<CheckDataPage />} />
      </Route>

    </Routes>
    );
}
