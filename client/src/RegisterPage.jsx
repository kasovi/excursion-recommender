import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import styles from './RegisterPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function RegisterPage() {
  // State for username and password input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate username: must be alphanumeric
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      alert('Username can only contain alphanumeric characters.');
      return;
    }

    // Validate password: must be alphanumeric
    if (!password.match(/^[a-zA-Z0-9]+$/)) {
      alert('Password can only contain alphanumeric characters.');
      return;
    }

    try {
      // Send registration data to backend
      const response = await axios.post('http://localhost:8080/api/auth/register', { username, password });
      alert(response.data.message);
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      // Show error message from backend or generic error
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <div className={styles.formBox}>
          {/* Registration form */}
          <form onSubmit={handleRegister}>
            {/* Username input */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            {/* Submit button */}
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
        </div>
        {/* Link to login page */}
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