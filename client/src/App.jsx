import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [selectedTags, setSelectedTags] = useState([])
  const [paragraph, setParagraph] = useState("")

  const tags = ['Adventure', 'Relaxation', 'Cultural', 'Nature']

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/recommendations", {
        selectedTags,
        paragraph,
      });
      console.log('Response from server:', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
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
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App
