import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.css';
import PageWrapper from './PageWrapper'; // Import The PageWrapper
import { useUserContext } from './UserContext';

function LoginPage() {
  const [username, setUsername] = useState(''); // Username State
  const [password, setPassword] = useState(''); // Password State
  const navigate = useNavigate(); // Navigation Hook
  const { setUser } = useUserContext(); // Set User Context

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent Reload
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password }); // Login Request
      alert(response.data.message); // Show Message
      setUser(username); // Set User
      navigate('/dashboard'); // Go Dashboard
    } catch (error) {
      alert(error.response?.data?.error || 'Login Failed'); // Show Error
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Login</h1>
        <div className={styles.formBox}>
          <form onSubmit={handleLogin}>
            {/* Username Input */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            {/* Login Button */}
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
        {/* Register Link */}
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