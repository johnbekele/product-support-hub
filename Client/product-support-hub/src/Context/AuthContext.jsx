import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // start loading true while checking token
  const [error, setError] = useState(null);

  // On mount: load token from localStorage, decode and check expiration
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decodedUser = jwtDecode(savedToken);

        // Check expiration (exp in seconds, convert to ms)
        if (decodedUser.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        } else {
          // Token valid
          setUser(decodedUser);
          setToken(savedToken);
        }
      } catch (err) {
        // Invalid token
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  // Save or remove token in localStorage when token state changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  async function login(identifier, password) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { identifier, password },
        { withCredentials: true }
      );

      const newToken = response.data.token;
      const newUser = jwtDecode(newToken);

      setUser(newUser);
      setToken(newToken);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  }

  async function logout() {
    try {
      await axios.post(
        'http://localhost:3000/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Logout failed', err);
    }
    setUser(null);
    setToken(null);
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, error, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
