import { useLocation } from 'react-router-dom';

function ResultsPage() {
  const location = useLocation();
  const { responseData } = location.state || {};

  if (!responseData) {
    return <p>No data available. Please go back and try again.</p>;
  }

  const { query, summary, rawResults } = responseData;

  return (
    <div className="App">
      <h1>Excursion Results</h1>
      <div>
        <h2>Generated Query:</h2>
        <p>{query}</p>
      </div>
      <div>
        <h2>Summary:</h2>
        <p>{summary}</p>
      </div>
      <div>
        <h2>Top Results:</h2>
        <ul>
          {rawResults.map((result, index) => (
            <li key={index}>
              <strong>{result.name}</strong> - {result.formatted_address} (Rating: {result.rating})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResultsPage;