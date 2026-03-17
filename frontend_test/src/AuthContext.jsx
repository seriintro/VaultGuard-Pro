import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
const API_BASE = 'http://127.0.0.1:5000';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { name, role }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount, validate stored token with the backend
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setIsAuthenticated(true);
        setCurrentUser({ name: data.name, role: data.role });
      })
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem('token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (token, name, role) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setCurrentUser({ name, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}