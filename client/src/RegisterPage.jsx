import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', { username, password });
      alert(response.data.message);
      navigate('/main');
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', fontSize: '16px', width: '300px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', fontSize: '16px', width: '300px' }}
        />
        <button
          type="submit"
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;