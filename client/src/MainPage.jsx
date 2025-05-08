import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './MainPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function MainPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [paragraph, setParagraph] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const tags = ['Adventure', 'Relaxation', 'Cultural', 'Nature', 'Romantic', 'Family', 'Luxury', 'Budget', 'Food', 'Historic'];

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!city) {
        alert('Please enter a city.');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/recommendations/', {
        selectedTags,
        paragraph,
        city,
      });

      navigate('/results', { state: { responseData: response.data } });
    } catch (error) {
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(`http://localhost:8080/api/location/reverse-geocode`, {
            params: { latitude, longitude },
          });

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
            <div className={styles.section}>
              <h2>Select Tags:</h2>
              <div className={styles.tags}>
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
            <div className={styles.section}>
              <h2>Enter a Paragraph:</h2>
              <textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                rows="5"
                placeholder="Describe your ideal excursion..."
                className={styles.textarea}
              />
            </div>
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
              <button
                type="button"
                onClick={handleUseLocation}
                className={styles.button}
              >
                Use My Location
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
        <button
          className={styles.homeButton}
          onClick={() => navigate('/dashboard')}
        >
          Home
        </button>
      </div>
    </PageWrapper>
  );
}

export default MainPage;
