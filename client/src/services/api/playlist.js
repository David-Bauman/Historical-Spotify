import {axiosInstance} from './../axios-instance';

export function fetchMostRecentPlaylist(id) {
	const query = `
		query {
			mostRecentPlaylist(id: "${id}") {
				possibleDates
				songs {
					album
					artists
					duration
					name
					songId
				}
				overview {
					description
					imageURL
					name
					user
				}
			}
		}
	`;

	return axiosInstance.post('', JSON.stringify({query}));
}

export function fetchHistoricalPlaylist(id, date) {
	const query = `
		query {
			historicalPlaylist(id: "${id}", date: "${date}") {
				songs {
					album
					artists
					duration
					name
					songId
				}
				overview {
					description
					imageURL
				}
			}
		}
	`;
	return axiosInstance.post('', JSON.stringify({query}));
}