import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './LandingPage'; 
import MainPage from './MainPage'; 
import TestPage from './TestPage';
import ResultsPage from './ResultsPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as the default route */}
        <Route path="/main" element={<MainPage />} /> {/* Move MainPage to /main */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
