import axios from 'axios';

export function getUserName(token) {
    return axios({
        url: 'https://api.spotify.com/v1/me',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
