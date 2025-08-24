import './index.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Routes, Route } from 'react-router-dom';


import Home from './pages/Home';
import StudentHomepage from './pages/StudentHomepage';
import ProfessorHomepage from './pages/ProfessorHomepage';
import QrReaderPage from './pages/QrReader';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/" element={<StudentHomepage />} />
        <Route path="/professor/" element={<ProfessorHomepage />} />
        <Route path="/student/qr-reader" element={<QrReaderPage />} />
      </Routes>
    );
  }
}