import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Excursion Recommender</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <h2>Select Tags:</h2>
          {tags.map((tag) => (
            <label key={tag} style={{ margin: '10px', display: 'inline-block' }}>
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
        <div style={{ marginTop: '20px' }}>
          <h2>Enter a Paragraph:</h2>
          <textarea
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows="5"
            cols="40"
            placeholder="Describe your ideal excursion..."
            style={{ margin: '10px', padding: '10px', fontSize: '16px', width: '300px' }}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>Enter a City:</h2>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., Los Angeles)"
            required
            style={{ margin: '10px', padding: '10px', fontSize: '16px', width: '300px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default MainPage;
