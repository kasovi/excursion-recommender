import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Welcome to Excursion Recommender</h1>
        <p className={styles.subtitle}>Plan your perfect outing with ease!</p> {/* Apply subtitle class */}
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => navigate('/login')}>
            Login
          </button>
          <button className={styles.button} onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default LandingPage;