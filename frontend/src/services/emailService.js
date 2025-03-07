import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Get all emails with pagination
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated emails
 */
export const getEmails = async (page = 1, perPage = 20, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      ...filters
    });
    
    const response = await axios.get(`${API_URL}/emails?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

/**
 * Get a single email by ID
 * @param {number} id - Email ID
 * @returns {Promise<Object>} Email data
 */
export const getEmailById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/emails/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching email ${id}:`, error);
    throw error;
  }
};

/**
 * Sync emails from Gmail
 * @returns {Promise<Object>} Sync result
 */
export const syncEmails = async () => {
  try {
    const response = await axios.get(`${API_URL}/emails/sync`);
    return response.data;
  } catch (error) {
    console.error('Error syncing emails:', error);
    throw error;
  }
};

/**
 * Analyze a single email for phishing
 * @param {number} id - Email ID
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeEmail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/emails/${id}/analyze`);
    return response.data;
  } catch (error) {
    console.error(`Error analyzing email ${id}:`, error);
    throw error;
  }
};

/**
 * Get email statistics
 * @returns {Promise<Object>} Email statistics
 */
export const getEmailStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching email stats:', error);
    throw error;
  }
};

export const analyzeEmailWithAI = async (emailId, onChunk, onError, onComplete) => {
  try {
    const response = await fetch(`${API_URL}/emails/${emailId}/analyze_with_ai`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to start analysis');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    onError(error.message);
  }
}; 