import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animation
import { useState } from 'react';

// Animation variants for header appearance/disappearance
const headerVariants = {
  initial: { opacity: 0, y: -20 }, // Start hidden and slightly above
  animate: { opacity: 1, y: 0 },   // Animate to visible and in place
  exit: { opacity: 0, y: -20 },    // Animate out by moving up and fading
};

// Animation transition settings
const headerTransition = {
  duration: 0.3,
  ease: 'easeOut',
};

function Header() {
  // Access user context and navigation
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  // State for button background colors (for hover effects)
  const [homeBgColor, setHomeBgColor] = useState('#0095d2'); // Default blue
  const [logoutBgColor, setLogoutBgColor] = useState('#ff4d4d'); // Default red

  // Handle logout: clear user and redirect to landing page
  const handleLogout = () => {
    setUser(null); // Remove user from context
    navigate('/'); // Go to landing page
  };

  return (
    <motion.header
      style={{
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between', // Space out Home, Username, Logout
        alignItems: 'center', // Vertically center items
      }}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={headerTransition}
    >
      {/* Home Button: navigates to dashboard, with hover color effect */}
      <button
        onClick={() => navigate('/dashboard')}
        onMouseEnter={() => setHomeBgColor('#007bb5')} // Darker blue on hover
        onMouseLeave={() => setHomeBgColor('#0095d2')} // Reset to default
        style={{
          padding: '5px 10px',
          backgroundColor: homeBgColor,
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          height: '36px', 
        }}
      >
        Home
      </button>

      {/* Centered Username: only shown if user is logged in */}
      <div style={{ textAlign: 'center', flex: 1 }}>
        {user && (
          <p
            style={{
              margin: 0,
              lineHeight: '1.5',
              fontSize: '1.5rem', 
            }}
          >
            {user}
          </p>
        )}
      </div>

      {/* Logout Button: logs out user, with hover color effect */}
      <button
        onClick={handleLogout}
        onMouseEnter={() => setLogoutBgColor('#cc0000')} // Darker red on hover
        onMouseLeave={() => setLogoutBgColor('#ff4d4d')} // Reset to default
        style={{
          padding: '5px 10px',
          backgroundColor: logoutBgColor,
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          height: '36px',
        }}
      >
        Log out
      </button>
    </motion.header>
  );
}

export default Header;