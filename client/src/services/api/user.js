import axios from 'axios';
import {axiosInstance} from './../axios-instance';

export function getUserName(token) {
  return axios({
    url: 'https://api.spotify.com/v1/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

export function logUser(username) {
  const mutation = `
    mutation {
      logUser(name: "${username}")
    }
  `;
  return axiosInstance.post('', JSON.stringify({"query": mutation}));
}
