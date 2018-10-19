import axios from 'axios';

export function getUserAuth() {
  return axios.get('https://bauman.zapto.org:4000/userAuthRedirect');
}

export function getInitialAccessToken(code) {
  return axios.post('https://bauman.zapto.org:4000/codeToToken', {code: code});
}

export function refreshAccessToken(code) {
  return axios.post('https://bauman.zapto.org:4000/refreshToken', {code: code});
}

