import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from './UserContext';
import { useState } from 'react';
import styles from './ResultsPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext(); // Get the logged-in user's username
  const { responseData } = location.state || {};

  // Show message if no data is available
  if (!responseData) {
    return <p>No data available. Please go back and try again.</p>;
  }

  const { summary, rawResults } = responseData;

  // Parse the summary into individual summaries for each result
  const parsedSummaries = summary.split('\n').filter((line) => line.trim() !== '');

  // State to track which item is expanded
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Track if the recommendation is saved to the user's library
  const [isSaved, setIsSaved] = useState(false);

  // Expand/collapse result details
  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Save recommendation to backend for the user
  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/recommendations/save', {
        username: user,
        title: responseData.title, // Include the title
        summary: responseData.summary,
        rawResults: responseData.rawResults,
      });
      alert(response.data.message);
      setIsSaved(true); // Mark as saved
    } catch (error) {
      alert('Failed to save recommendation.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        {/* Show the title, removing any quotes */}
        <h1>{responseData.title.replace(/['"]+/g, '')}</h1>
        <div>
          <h2>Top Results:</h2>
          <ul className={styles.list}>
            {/* List each result with expandable details */}
            {rawResults.map((result, index) => (
              <li key={index} className={styles.listItem}>
                <div
                  onClick={() => handleToggle(index)}
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#87ceeb', // Light blue for clickable text
                  }}
                >
                  {result.name} - {result.formatted_address} (Rating: {result.rating})
                </div>
                <div
                  className={`${styles.summary} ${expandedIndex === index ? styles.open : ''}`}
                >
                  <p>{parsedSummaries[index] || 'No summary available for this location.'}</p>
                  {/* Google Maps link for the location */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.formatted_address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.googleMapsLink}
                  >
                    View on Google Maps
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Save and navigation buttons */}
        <div className={styles.buttonContainer}>
          <button
            onClick={handleSave}
            className={styles.button}
            disabled={isSaved} // Disable the button if already saved
          >
            {isSaved ? 'Saved' : 'Save to Library'}
          </button>
          <button onClick={() => navigate('/dashboard')} className={styles.button}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ResultsPage;