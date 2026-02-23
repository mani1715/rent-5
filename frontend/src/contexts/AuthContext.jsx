import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { DEMO_MODE, MOCK_USERS, MOCK_TOKEN } from '@/config/demo';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('demoUser');
      
      // Demo Mode: Use localStorage user
      if (DEMO_MODE && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken || MOCK_TOKEN);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Demo auth error:', error);
        }
      }
      
      // Real Mode: Check with backend
      if (storedToken && !DEMO_MODE) {
        try {
          const response = await axios.get(`${API_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.success) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (name, email, password, role = null) => {
    // Demo Mode: Mock registration
    if (DEMO_MODE) {
      const mockUser = { ...MOCK_USERS.customer, name, email };
      localStorage.setItem('token', MOCK_TOKEN);
      localStorage.setItem('demoUser', JSON.stringify(mockUser));
      setToken(MOCK_TOKEN);
      setUser(mockUser);
      return { success: true, requiresRoleSelection: !role };
    }
    
    // Real Mode: Call backend
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { success: true, requiresRoleSelection: response.data.requiresRoleSelection };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    // Demo Mode: Mock login
    if (DEMO_MODE) {
      // Determine user type based on email
      const mockUser = email.includes('owner') ? MOCK_USERS.owner : MOCK_USERS.customer;
      localStorage.setItem('token', MOCK_TOKEN);
      localStorage.setItem('demoUser', JSON.stringify(mockUser));
      setToken(MOCK_TOKEN);
      setUser(mockUser);
      return { 
        success: true, 
        requiresRoleSelection: false,
        user: mockUser 
      };
    }
    
    // Real Mode: Call backend
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { 
          success: true, 
          requiresRoleSelection: response.data.requiresRoleSelection,
          user: user 
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const selectRole = async (role) => {
    // Demo Mode: Update mock user
    if (DEMO_MODE) {
      const updatedUser = { ...user, role };
      localStorage.setItem('demoUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    }
    
    // Real Mode: Call backend
    try {
      const response = await axios.post(
        `${API_URL}/api/user/select-role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Role selection failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demoUser');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    selectRole,
    isAuthenticated: !!user,
    isOwner: user?.role === 'OWNER',
    isCustomer: user?.role === 'CUSTOMER',
    requiresRoleSelection: user && !user.role
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
