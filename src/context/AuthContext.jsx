import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock checking for an existing session on load
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      // Simulate network delay
      setTimeout(() => {
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }, 500);
    };
    checkSession();
  }, []);

  const login = async (provider) => {
    // Mock login function
    const mockUser = {
      id: 'mock-user-123',
      email: 'user@example.com',
      name: 'Test User',
      provider: provider || 'email',
    };
    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
