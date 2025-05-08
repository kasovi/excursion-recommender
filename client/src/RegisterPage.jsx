import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import styles from './RegisterPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', { username, password });
      alert(response.data.message);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <div className={styles.formBox}>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
        </div>
        <p>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}

export default RegisterPage;