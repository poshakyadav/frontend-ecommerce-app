// useAuth.tsx

// src/hooks/useAuth.tsx

import { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  // Add other relevant user properties based on your backend User model
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('access_token');
  //     if (token) {
  //       setIsAuthenticated(true);
  //       try {
  //         // Assuming you have an endpoint like /auth/me or /users/me to fetch user details
  //         const response = await api.get('/users/me'); // Adjust the endpoint as needed
  //         setUser(response.data.data); // Assuming your user details are under the 'data' property
  //         setLoading(false);
  //       } catch (error) {
  //         console.error('Error fetching user details:', error);
  //         setIsAuthenticated(false);
  //         setUser(null);
  //         setLoading(false);
  //         localStorage.removeItem('access_token'); // Clear invalid token
  //       }
  //     } else {
  //       setIsAuthenticated(false);
  //       setUser(null);
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/users/me');
          setIsAuthenticated(true);
          setUser(response.data.data);
        } catch (error: any) {
          console.error('Error fetching user details:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
            setUser(null);
          } // Else, keep token and retry on next load
        } finally {
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  const login = async (accessToken: string) => {
    localStorage.setItem('access_token', accessToken);
    setIsAuthenticated(true);
    try {
      // After login, fetch user details
      const response = await api.get('/users/me'); // Adjust the endpoint as needed
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user details after login:', error);
      // Optionally handle error, maybe logout the user
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};