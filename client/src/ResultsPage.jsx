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

  if (!responseData) {
    return <p>No data available. Please go back and try again.</p>;
  }

  const { summary, rawResults } = responseData;

  // Parse the summary into individual summaries for each result
  const parsedSummaries = summary.split('\n').filter((line) => line.trim() !== '');

  // State to track which item is expanded
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/recommendations/save', {
        username: user,
        title: responseData.title, // Include the title
        summary: responseData.summary,
        rawResults: responseData.rawResults,
      });
      alert(response.data.message);
    } catch (error) {
      alert('Failed to save recommendation.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>{responseData.title.replace(/['"]+/g, '')}</h1> {/* Remove quotation marks from the title */}
        <button
          className={styles.backButton}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
        <div>
          <h2>Top Results:</h2>
          <ul className={styles.list}>
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
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.button}>
            Save to Library
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