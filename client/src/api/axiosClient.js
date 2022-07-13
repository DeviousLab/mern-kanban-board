import axios from 'axios';
import queryString from 'query-string';

const baseURL = '/api/v1' || process.env.REACT_APP_API_URL;
const getToken = () => localStorage.getItem('token');

const axiosClient = axios.create({
  baseURL,
  paramsSerializer: params => queryString.stringify({ params }),
});

axiosClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    }
  }
});

axiosClient.interceptors.response.use(response => {
  if (response && response.data) return response.data;
  return response;
}, error => {
  if (!error.response) {
    return alert(error);
  }
  throw error.response;
});

export default axiosClient;