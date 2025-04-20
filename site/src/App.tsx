import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import Home from './pages/Home'
import ResumePage from './pages/ResumePage'

// Redirect component to handle the stored URL from the 404 page
function RedirectHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we have a stored redirect URL
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    if (redirectUrl) {
      // Clear the stored URL
      sessionStorage.removeItem('redirectUrl');
      // Navigate to the stored URL
      navigate(redirectUrl);
    }
  }, [navigate]);
  
  return null;
}

function App() {
  return (
    <Router>
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
