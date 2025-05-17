import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence for route transitions
import { motion } from 'framer-motion'; // Import motion for animating components

import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import MainPage from './MainPage';
import TestPage from './TestPage';
import ResultsPage from './ResultsPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import LibraryPage from './LibraryPage';
import Header from './Header';
import ItineraryPage from './ItineraryPage'; 
import ViewItineraryPage from './ViewItineraryPage'; 

function AppContent() {
  const location = useLocation();

  // List of routes where the header should NOT be shown
  const noHeaderRoutes = ['/', '/login', '/register', '/dashboard'];

  return (
    <AnimatePresence mode="wait">
      {/* Conditionally render the animated header unless on a no-header route */}
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
      {/* AnimatePresence enables page transitions for routes */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} /> 
        <Route path="/view-itineraries" element={<ViewItineraryPage />} /> 
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // Wrap the app in a Router to enable routing throughout the app
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
