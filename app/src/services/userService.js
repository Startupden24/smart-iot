import axios from 'axios';

import REACT_API_BASE_URL from "../config.js";

const userService = {
  signup: async (userData) => {
    try {
      const response = await axios.post(`${REACT_API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
  login: async (userData) => {
    try {
      const response = await axios.post(`${REACT_API_BASE_URL}/login`, userData);
      return response.data;
    } catch (error) {
      //console.log(error);
      console.error('Error signing in:', error.response.data.message);
      throw error.response.data;
    }
  },
  verifyUser: async (token) => {
    try {
      const response = await axios.post(`${REACT_API_BASE_URL}/loginverify`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
}
}

export default userService;
