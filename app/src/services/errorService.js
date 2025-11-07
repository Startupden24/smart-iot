import axios from 'axios';

axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Handle network error globally
      window.location.href = '/error';  // Redirect to custom error page
    }
    return Promise.reject(error);
  }
);
