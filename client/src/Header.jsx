import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from framer-motion

const headerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const headerTransition = {
  duration: 0.3,
  ease: 'easeOut',
};

function Header() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear the username from context
    navigate('/'); // Redirect to the Landing Page
  };

  return (
    <motion.header
      style={{
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between', // Space between Home, Username, and Logout
        alignItems: 'center', // Ensures vertical alignment
      }}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={headerTransition}
    >
      {/* Home Button */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '5px 10px',
          backgroundColor: '#646cff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          height: '36px', // Consistent height
        }}
      >
        Home
      </button>

      {/* Centered Username */}
      <div style={{ textAlign: 'center', flex: 1 }}>
        {user && (
          <p
            style={{
              margin: 0,
              lineHeight: '1.5',
              fontSize: '1.5rem', // Increased font size
            }}
          >
            {user}
          </p>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          padding: '5px 10px',
          backgroundColor: '#ff4d4d', // Red for logout
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          height: '36px', // Consistent height
        }}
      >
        Logout
      </button>
    </motion.header>
  );
}

export default Header;