import { useState, useEffect } from 'react';
import axios from 'axios';

function TestPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTestMessage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/test');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching test message:', error);
        setMessage('Failed to connect to the server.');
      }
    };

    fetchTestMessage();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <p>Server Message: {message}</p>
    </div>
  );
}

export default TestPage;