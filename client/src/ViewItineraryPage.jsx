import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ViewItineraryPage.module.css'; 
import PageWrapper from './PageWrapper';
import { useUserContext } from './UserContext';

function ViewItineraryPage() {
  const { user } = useUserContext(); // Get current logged-in user
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]); // Store user's itineraries

  // Fetch itineraries from backend on mount or when user changes
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/recommendations/itineraries', {
          params: { username: user },
        });
        setItineraries(response.data); // Save itineraries to state
      } catch (error) {
        alert('Failed to fetch itineraries.');
      }
    };

    fetchItineraries();
  }, [user]);

  // Delete an itinerary by title
  const handleDeleteItinerary = async (title) => {
    try {
      const response = await axios.delete('http://localhost:8080/api/recommendations/itineraries/delete', {
        data: { username: user, title },
      });
      alert(response.data.message);
      // Remove deleted itinerary from state
      setItineraries((prev) => prev.filter((itinerary) => itinerary.title !== title));
    } catch (error) {
      alert('Failed to delete itinerary.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Your Itineraries</h1>
        {/* Show message if no itineraries, else list them */}
        {itineraries.length === 0 ? (
          <p>No itineraries found.</p>
        ) : (
          <ul className={styles.list}>
            {itineraries.map((itinerary, index) => (
              <li key={index} className={styles.listItem}>
                <h3>{itinerary.title}</h3>
                <ul>
                  {/* List locations for each itinerary */}
                  {itinerary.locations.map((location, locIndex) => (
                    <li key={locIndex} className={styles.subListItem}>
                      {location.name} - {location.formatted_address}
                    </li>
                  ))}
                </ul>
                {/* Delete button for itinerary */}
                <button
                  onClick={() => handleDeleteItinerary(itinerary.title)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* Back to Library button */}
        <button onClick={() => navigate('/library')} className={styles.button}>
          Back to Library
        </button>
      </div>
    </PageWrapper>
  );
}

export default ViewItineraryPage;