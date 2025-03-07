import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios to include credentials
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

/**
 * Get the current logged in user
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error('Not authenticated');
  }
};

/**
 * Redirect to Google OAuth login
 */
export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/login`;
};

/**
 * Logout the current user
 */
export const logout = () => {
  window.location.href = `${API_URL}/auth/logout`;
}; 