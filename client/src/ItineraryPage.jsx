import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './ItineraryPage.module.css';
import PageWrapper from './PageWrapper';
import { useUserContext } from './UserContext';

function ItineraryPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const recommendations = location.state?.recommendations || []; // Retrieve recommendations from state

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [title, setTitle] = useState('');

  const handleToggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleSaveItinerary = async () => {
    if (!title) {
      alert('Please provide a title for your itinerary.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/recommendations/itineraries/save', {
        username: user,
        title,
        locations: selectedLocations,
      });
      alert(response.data.message);
      navigate('/library'); // Redirect to library after saving
    } catch (error) {
      alert('Failed to save itinerary.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Create Itinerary</h1>
        <input
          type="text"
          placeholder="Itinerary Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <h2>Select Locations:</h2>
        <ul className={styles.list}>
          {recommendations.map((rec, recIndex) => (
            <li key={recIndex} className={styles.listItem}>
              <h3>{rec.title}</h3> {/* Display the recommendation title */}
              <ul>
                {rec.rawResults.map((location, locIndex) => (
                  <li key={locIndex} className={styles.subListItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => handleToggleLocation(location)}
                      />
                      {location.name} - {location.formatted_address} (Rating: {location.rating || 'N/A'})
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <button onClick={handleSaveItinerary} className={styles.button}>
          Save Itinerary
        </button>
      </div>
    </PageWrapper>
  );
}

export default ItineraryPage;