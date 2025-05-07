import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Excursion Recommender</h1>
      <p>Plan your perfect outing with ease!</p>
      <div style={{ marginTop: '20px' }}>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default LandingPage;