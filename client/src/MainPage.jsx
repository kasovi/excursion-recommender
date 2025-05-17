import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './MainPage.module.css';
import PageWrapper from './PageWrapper'; // Page layout wrapper

function MainPage() {
  // State for selected tags, user paragraph, city input, and loading spinner
  const [selectedTags, setSelectedTags] = useState([]);
  const [paragraph, setParagraph] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // List of tags user can select for excursion preferences
  const tags = [
    'Adventure',
    'Relaxation',
    'Cultural',
    'Nature',
    'Romantic',
    'Family',
    'Luxury',
    'Budget',
    'Food',
    'Historic',
    'Shopping',
    'Nightlife',
    'Beaches',
    'Wildlife',
    'Art',
    'Music',
    'Sports',
    'Wellness',
    'Festivals',
    'Photography',
    'Spiritual',
    'Educational',
    'Extreme Sports',
    'Volunteering',
  ];

  // Toggle tag selection on click
  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Submit form: send user input to backend and navigate to results page
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Require city input before submitting
      if (!city) {
        alert('Please enter a city.');
        setIsLoading(false);
        return;
      }
      // Require at least one tag or paragraph
      if (selectedTags.length === 0 && paragraph.trim() === '') {
        alert('Please select at least one tag or enter a description.');
        setIsLoading(false);
        return;
      }

      // Send POST request with user selections
      const response = await axios.post('http://localhost:8080/api/recommendations/', {
        selectedTags,
        paragraph,
        city,
      });

      // Navigate to results page with response data
      navigate('/results', { state: { responseData: response.data } });
    } catch (error) {
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use browser geolocation to auto-fill city input
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    // Get user's current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode coordinates to get city name
          const response = await axios.get(`http://localhost:8080/api/location/reverse-geocode`, {
            params: { latitude, longitude },
          });

          // Set city if found, else show error
          if (response.data.city) {
            setCity(response.data.city);
          } else {
            alert('Unable to determine city from your location.');
          }
        } catch (error) {
          alert('Failed to fetch location details.');
        }
      },
      (error) => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.formBox}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Tag selection section */}
            <div className={styles.section}>
              <h2>Select Tags:</h2>
              <div className={styles.tags}>
                {/* Render tag buttons, highlight if selected */}
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagLabel} ${selectedTags.includes(tag) ? styles.selected : ''}`}
                    onClick={() => handleTagChange(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {/* Freeform user input */}
            <div className={styles.section}>
              <h2>Any other requests?</h2>
              <textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                rows="5"
                placeholder="Describe your ideal excursion..."
                className={styles.textarea}
              />
            </div>
            {/* City input and location button */}
            <div className={styles.section}>
              <h2>Enter a City:</h2>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name (e.g., Los Angeles)"
                required
                className={styles.input}
              />
              {/* Button to use geolocation */}
              <button
                type="button"
                onClick={handleUseLocation}
                className={styles.button}
              >
                Use My Location
              </button>
            </div>
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}

export default MainPage;
