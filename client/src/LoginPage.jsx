import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper
import { useUserContext } from './UserContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      alert(response.data.message);
      setUser(username);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Login</h1>
        <div className={styles.formBox}>
          <form onSubmit={handleLogin}>
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
              Login
            </button>
          </form>
        </div>
        <p>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register now
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}

export default LoginPage;