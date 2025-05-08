import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { motion } from 'framer-motion'; // Import motion

import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import MainPage from './MainPage';
import TestPage from './TestPage';
import ResultsPage from './ResultsPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import LibraryPage from './LibraryPage';
import Header from './Header';

function AppContent() {
  const location = useLocation();

  // Define routes where the header should not appear
  const noHeaderRoutes = ['/', '/login', '/register', '/dashboard'];

  return (
    <AnimatePresence mode="wait">
      {!noHeaderRoutes.includes(location.pathname) && (
        <motion.div
          key="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Header />
        </motion.div>
      )}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
