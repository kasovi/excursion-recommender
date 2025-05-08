import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';
import styles from './LibraryPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function LibraryPage() {
  const { user } = useUserContext(); // Get the logged-in user's username
  const [recommendations, setRecommendations] = useState([]);

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

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Your Saved Recommendations</h1>
        {recommendations.length === 0 ? (
          <p>No saved recommendations yet.</p>
        ) : (
          <ul className={styles.list}>
            {recommendations.map((rec, index) => (
              <li key={index} className={styles.listItem}>
                <h2>{rec.title}</h2> {/* Display the title */}
                <h3>Summary:</h3>
                <p>{rec.summary}</p>
                <h3>Top Results:</h3>
                <ul>
                  {rec.rawResults.map((result, idx) => (
                    <li key={idx}>
                      <strong>{result.name}</strong> - {result.formatted_address} (Rating: {result.rating})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}

export default LibraryPage;