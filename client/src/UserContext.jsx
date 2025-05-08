import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize the username from localStorage if it exists
    return localStorage.getItem('username') || null;
  });

  useEffect(() => {
    // Update localStorage whenever the user changes
    if (user) {
      localStorage.setItem('username', user);
    } else {
      localStorage.removeItem('username');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);