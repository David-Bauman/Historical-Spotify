import axios from 'axios';

//expects a SpotifyPlayer as second option
export function playSong(URI, {_options: {getOAuthToken, id}}) {
  getOAuthToken(token => {
    axios({
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

