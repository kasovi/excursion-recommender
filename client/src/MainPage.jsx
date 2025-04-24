import { useState } from 'react';
import axios from 'axios';

function MainPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [paragraph, setParagraph] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.post('http://localhost:8080/api/recommendations', {
        selectedTags,
        paragraph,
      });
      setResponseMessage(response.data.queryPrompt); // Display the query prompt from the backend
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponseMessage('An error occurred while processing your request.');
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {responseMessage && (
        <div>
          <h2>Response:</h2>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
}

export default MainPage;
