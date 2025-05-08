import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';
import styles from './LibraryPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper
import { useNavigate } from 'react-router-dom';

function LibraryPage() {
  const { user } = useUserContext(); // Get the logged-in user's username
  const [recommendations, setRecommendations] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which recommendation is expanded
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/recommendations/library', {
          params: { username: user },
        });
        setRecommendations(response.data);
      } catch (error) {
        alert('Failed to fetch saved recommendations.');
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDeleteRecommendation = async (title) => {
    try {
      const response = await axios.delete('http://localhost:8080/api/recommendations/library/delete', {
        data: { username: user, title },
      });
      alert(response.data.message);
      setRecommendations((prev) => prev.filter((rec) => rec.title !== title)); // Remove from state
    } catch (error) {
      alert('Failed to delete recommendation.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Your Saved Recommendations</h1>
        {recommendations.length === 0 ? (
          <p>No saved recommendations yet.</p>
        ) : (
          <ul className={styles.list}>
            {recommendations.map((rec, index) => {
              // Parse the summary into individual summaries for each location
              const parsedSummaries = rec.summary
                .split('\n')
                .filter((line) => line.trim() !== '') // Remove empty lines
                .map((line) => line.substring(3)); // Remove the first 3 characters from each line

              return (
                <li key={index} className={styles.listItem}>
                  <div
                    onClick={() => handleToggle(index)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#646cff', // Highlighted color for clickable text
                    }}
                  >
                    {rec.title}
                  </div>
                  <div
                    className={`${styles.dropdown} ${expandedIndex === index ? styles.open : ''}`}
                  >
                    <h3>Locations:</h3>
                    <ul>
                      {rec.rawResults.map((result, idx) => (
                        <li key={idx} className={styles.locationItem}>
                          <strong>{result.name}</strong> - {result.formatted_address} (Rating: {result.rating || 'N/A'})
                          <p className={styles.summary}>
                            {parsedSummaries[idx] || 'No summary available for this location.'}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleDeleteRecommendation(rec.title)}
                      className={styles.deleteButton}
                    >
                      Delete Recommendation
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <button
          onClick={() => navigate('/itinerary', { state: { recommendations } })}
          className={styles.button}
        >
          Create Itinerary
        </button>
        <button
          onClick={() => navigate('/view-itineraries')}
          className={styles.button}
        >
          View Itineraries
        </button>
      </div>
    </PageWrapper>
  );
}

export default LibraryPage;