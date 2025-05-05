import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './MainPage';
import TestPage from './TestPage';
import ResultsPage from './ResultsPage'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/results" element={<ResultsPage />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
