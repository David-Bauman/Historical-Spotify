import {axiosInstance} from './../axios-instance';

const query = `
	query {
		playlists {
			name
			description
			createDate
			imageURL
			views
			id
  	}
	}
`;

export function fetchPlaylists() {
	return axiosInstance.post('', JSON.stringify({query}));
}