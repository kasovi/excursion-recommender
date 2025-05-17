// UserContext provides a global user state (username) and keeps it in localStorage.
// Used to access or update the logged in user's name throughout the app, as well make db queries.

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// Provider component to wrap the app and manage user state
export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    return localStorage.getItem('username') || null;
  });

  useEffect(() => {
    // Sync user state with localStorage on change
    if (user) {
      localStorage.setItem('username', user);
    } else {
      localStorage.removeItem('username');
    }
  }, [user]);

  return (
    // Provide user and setUser to all children components
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);