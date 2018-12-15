import {axiosInstance} from './../axios-instance';

export function getUserAuth() {
  const mutation = `
    mutation {
      userAuth {
        url
      }
    }
  `;
  return axiosInstance.post('', JSON.stringify({"query": mutation}));
}

export function getInitialAccessToken(code) {
  const mutation = `
    mutation {
      codeToToken(code: "${code}") {
        refresh_token
        access_token
      }
    }
  `;
  return axiosInstance.post('', JSON.stringify({"query": mutation}));
}

export function refreshAccessToken(code) {
  const mutation = `
    mutation {
      refreshToken(code: "${code}") {
        access_token
      }
    }
  `;
  return axiosInstance.post('', JSON.stringify({"query": mutation}));
}

