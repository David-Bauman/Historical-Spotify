import {axiosInstance} from './../axios-instance';

export function addPlaylist(link) {
	const mutation = `
		mutation {
			addPlaylist(link: "${link}") {
				name
				description
				imageURL
				id
			}
		}
	`;
	return axiosInstance.post('', JSON.stringify({"query": mutation}));
}

export function fetchPlaylistIds() {
	const query = `
		query {
			playlists {
				name
				id
			}
		}
	`;
	return axiosInstance.post('', JSON.stringify({query}));
}