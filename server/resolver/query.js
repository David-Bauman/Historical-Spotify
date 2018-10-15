const connect = require('./../db_auth').connect;

const getPlaylists = () => {
    const connection = connect();
	return new Promise((resolve, reject) => {
		connection.connect(err => {
			if (err) reject(err);
			connection.query(
				'SELECT id, name, description, imageURL, views, createDate FROM hs_playlists.general ORDER BY views DESC;',
				(err, result) => {
					if (err) reject(err);
					resolve(result);
				}
			);
		});
	});
};

const getMostRecentPlaylist = ({id}) => {
    const connection = connect();
	return new Promise((resolve, reject) => {
		connection.connect(err => {
			if (err) reject(err);

			const songIdsQuery = 'SELECT songIds FROM hs_playlists.' + id +
				' WHERE timestamp=(SELECT MAX(timestamp) FROM hs_playlists.' + id + ');';

			connection.query(songIdsQuery, (err, result) => {
				if (err) reject(err);
				const ids = result[0]['songIds'].split(',');

				const songsQuery = 'SELECT * FROM hs_songs.' + id + ' WHERE songId IN (?) ORDER BY FIELD (songId, ?);';

				const generalInfoQuery = 'SELECT name, description, imageURL, user FROM hs_playlists.general WHERE id=\'' + id + '\';';

				const potentialDatesQuery = 'SELECT timestamp FROM hs_playlists.' + id + ' ORDER BY timestamp DESC;';

				const pageViewsUpdate = 'UPDATE hs_playlists.general SET views=views+1 WHERE id=\'' + id + '\';';

				connection.query(songsQuery + generalInfoQuery + potentialDatesQuery + pageViewsUpdate, [ids, ids], (err, result) => {
					if (err) reject(err);
					let dates = [];
					for (let i = 0; i < result[2].length; i++) {
						dates.push(result[2][i]['timestamp']);
					}
					resolve({songs: result[0], overview: result[1][0], possibleDates: dates});
				});
			});
		});
	});
};

const getHistoricalPlaylist = ({id, date}) => {
    const connection = connect();
	return new Promise((resolve, reject) => {
		connection.connect(err => {
			if (err) reject(err);

			const songIdsQuery = 'SELECT songIds FROM hs_playlists.' + id + ' WHERE timestamp=\'' + date + '\';';

			connection.query(songIdsQuery, (err, result) => {
				if (err) reject(err);
				const ids = result[0]['songIds'].split(',');

				const songsQuery = 'SELECT * FROM hs_songs.' + id + ' WHERE songId IN (?) ORDER BY FIELD (songId, ?);';

				const overviewQuery = 'SELECT description, imageURL FROM hs_playlists.' + id + ' WHERE timestamp=\'' + date + '\';';

				connection.query(songsQuery + overviewQuery, [ids, ids], (err, result) => {
					if (err) reject(err);
					resolve({songs: result[0], overview: result[1][0]});
				});
			});
		});
	});
};

module.exports = {
	getMostRecentPlaylist: getMostRecentPlaylist,
	getHistoricalPlaylist: getHistoricalPlaylist,
	getPlaylists: getPlaylists,
};
