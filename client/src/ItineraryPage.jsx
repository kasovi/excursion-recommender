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
  // Retrieve recommendations passed via navigation state
  const recommendations = location.state?.recommendations || []; 

  // State for selected location IDs and itinerary title
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [title, setTitle] = useState('');

  // Toggle a location's selection state by its place_id
  const handleToggleLocation = (location) => {
    setSelectedLocations((prev) => 
      prev.includes(location.place_id)
        ? prev.filter((id) => id !== location.place_id) // Deselect if already selected
        : [...prev, location.place_id] // Select if not already selected
    );
  };

  // Function to handle saving the itinerary
  const handleSaveItinerary = async () => {
    if (!title) {
      alert('Please provide a title for your itinerary.');
      return;
    }

    try {
      // Fetch existing itineraries for the user to check for duplicate titles
      const response = await axios.get('http://localhost:8080/api/recommendations/itineraries', {
        params: { username: user },
      });

      // Prevent saving if an itinerary with the same title exists
      const existingItinerary = response.data.find((itinerary) => itinerary.title === title);
      if (existingItinerary) {
        alert('An itinerary with this title already exists. Please choose a different title.');
        return;
      }

      // Flatten all locations from all recommendations into a single array
      const allLocations = recommendations.flatMap((rec) => rec.rawResults);
      // Only keep locations that the user selected
      const locationsToSave = allLocations.filter((loc) => selectedLocations.includes(loc.place_id));

      // Send the new itinerary to the backend for saving
      const saveResponse = await axios.post('http://localhost:8080/api/recommendations/itineraries/save', {
        username: user,
        title,
        locations: locationsToSave,
      });

      alert(saveResponse.data.message);
      navigate('/library'); // Redirect to the user's library after saving
    } catch (error) {
      alert('Failed to save itinerary.');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Create Itinerary</h1>
        {/* Input for itinerary title */}
        <input
          type="text"
          placeholder="Itinerary Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <h2>Select Locations:</h2>
        {recommendations.length === 0 ? ( // If no recommendations, show an alert
          <p>No recommendations available. Please generate recommendations first.</p>
        ) : (
          <ul className={styles.list}>
            {/* List each recommendation and its locations */}
            {recommendations.map((rec, recIndex) => (
              <li key={recIndex} className={styles.listItem}>
                <h3>{rec.title}</h3>
                <ul>
                  {rec.rawResults.map((location, locIndex) => (
                    <li key={locIndex} className={styles.subListItem}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location.place_id)}
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
        )}
        <button onClick={handleSaveItinerary} className={styles.button}>
          Save Itinerary
        </button>
      </div>
    </PageWrapper>
  );
}

export default ItineraryPage;