import axios from 'axios';

//expects a SpotifyPlayer as second param
export function playSong(URI, {_options: {getOAuthToken, id}}) {
  return getOAuthToken(token => {
    return axios({
      url: `https://api.spotify.com/v1/me/player/play?device_id=${id}`,
      method: 'put',
      data: JSON.stringify({uris: [URI]}),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  });
}

