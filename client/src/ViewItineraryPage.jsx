import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ViewItineraryPage.module.css'; 
import PageWrapper from './PageWrapper';
import { useUserContext } from './UserContext';

function ViewItineraryPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/recommendations/itineraries', {
          params: { username: user },
        });
        setItineraries(response.data);
      } catch (error) {
        alert('Failed to fetch itineraries.');
      }
    };

    fetchItineraries();
  }, [user]);

  const handleDeleteItinerary = async (title) => {
    try {
      const response = await axios.delete('http://localhost:8080/api/recommendations/itineraries/delete', {
        data: { username: user, title },
      });
      alert(response.data.message);
      setItineraries((prev) => prev.filter((itinerary) => itinerary.title !== title)); // Remove from state
    } catch (error) {
      alert('Failed to delete itinerary.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Your Itineraries</h1>
        {itineraries.length === 0 ? (
          <p>No itineraries found.</p>
        ) : (
          <ul className={styles.list}>
            {itineraries.map((itinerary, index) => (
              <li key={index} className={styles.listItem}>
                <h3>{itinerary.title}</h3>
                <ul>
                  {itinerary.locations.map((location, locIndex) => (
                    <li key={locIndex} className={styles.subListItem}>
                      {location.name} - {location.formatted_address}
                    </li>
                  ))}
                </ul>
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
        <button onClick={() => navigate('/library')} className={styles.button}>
          Back to Library
        </button>
      </div>
    </PageWrapper>
  );
}

export default ViewItineraryPage;