import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

function MainPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [paragraph, setParagraph] = useState('');
  const [city, setCity] = useState('');  // New state for city
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const tags = ['Adventure', 'Relaxation', 'Cultural', 'Nature'];

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Check if the city is entered
      if (!city) {
        alert('Please enter a city.');
        return;
      }

      console.log('Submitting data:', { selectedTags, paragraph, city });

      const response = await axios.post('http://localhost:8080/api/recommendations/', {
        selectedTags,
        paragraph,
        city,  // Include city in the payload
      });

      console.log("Response received:", response.data);
      // Pass the full response data to the results page
      navigate('/results', { state: { responseData: response.data } });
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Excursion Recommender</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Select Tags:</h2>
          {tags.map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
        <div>
          <h2>Enter a Paragraph:</h2>
          <textarea
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows="5"
            cols="40"
            placeholder="Describe your ideal excursion..."
          />
        </div>
        <div>
          <h2>Enter a City:</h2>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., Los Angeles)"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default MainPage;
