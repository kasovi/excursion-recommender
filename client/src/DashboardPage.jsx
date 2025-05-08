import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className={styles.container}>
        <h1>Welcome to Your Dashboard</h1>
        <p>What would you like to do?</p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => navigate('/main')} // Navigate to the recommendation generator
          >
            Generate a Recommendation
          </button>
          <button
            className={styles.button}
            onClick={() => navigate('/library')} // Navigate to the library
          >
            View Your Library
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default DashboardPage;