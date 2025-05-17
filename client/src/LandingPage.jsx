import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import PageWrapper from './PageWrapper'; 
import logo from './assets/logowhite.svg'; 

function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className={styles.container}>
        <img src={logo} alt="Excursion Recommender Logo" className={styles.logo} />
        <p className={styles.subtitle}>Plan your perfect outing with ease!</p>
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