import {axiosInstance} from './../axios-instance';

const query = `
  query {
    playlists {
      name
      imageURL
      id
    }
  }
`;

export function fetchSearchablePlaylists() {
  return axiosInstance.post('', JSON.stringify({query}));
}
