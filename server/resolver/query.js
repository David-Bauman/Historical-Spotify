const connect = require('./../db_auth').connect;

const getPlaylists = () => {
    const connection = connect();
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) reject(err);
            connection.query(
                'SELECT id, name, description, imageURL, views, createDate FROM hs_playlists.general ORDER BY views DESC;',
                (err, result) => {
                    connection.end();
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

            const escapedPlaylistId = connection.escapeId('hs_playlists.' + id);
            const escapedSongId = connection.escapeId('hs_songs.' + id);
            const escapedId = connection.escape(id);

            const songIdsQuery = 'SELECT songIds FROM ' + escapedPlaylistId +
            ' WHERE timestamp=(SELECT MAX(timestamp) FROM ' + escapedPlaylistId + ');';

            connection.query(songIdsQuery, (err, result) => {
                if (err) {
                    connection.end();
                    reject(err);
                }
                const escapedIds = connection.escape(result[0]['songIds'].split(','));

                const songsQuery = 'SELECT * FROM ' + escapedSongId + ' WHERE songId IN (' + escapedIds + ') ORDER BY FIELD (songId, ' + escapedIds + ');';

                const generalInfoQuery = 'SELECT name, description, imageURL, user FROM hs_playlists.general WHERE id=' + escapedId + ';';

                const potentialDatesQuery = 'SELECT timestamp FROM ' + escapedPlaylistId + ' ORDER BY timestamp DESC;';

                const pageViewsUpdate = 'UPDATE hs_playlists.general SET views=views+1 WHERE id=' + escapedId + ';';

                connection.query(songsQuery + generalInfoQuery + potentialDatesQuery + pageViewsUpdate, (err, result) => {
                    connection.end();
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

            const escapedPlaylistId = connection.escapeId('hs_playlists.' + id);
            const escapedSongId = connection.escapeId('hs_songs.' + id);
            const escapedId = connection.escape(id);
            const escapedDate = connection.escape(date);

            const songIdsQuery = 'SELECT songIds FROM ' + escapedPlaylistId + ' WHERE timestamp=' + escapedDate + ';';

            connection.query(songIdsQuery, (err, result) => {
                if (err) {
                    connection.end();
                    reject(err);
                }
                const escapedIds = connection.escape(result[0]['songIds'].split(','));

                const songsQuery = 'SELECT * FROM ' + escapedSongId + ' WHERE songId IN (' + escapedIds + ') ORDER BY FIELD (songId, ' + escapedIds + ');';

                const overviewQuery = 'SELECT description, imageURL FROM ' + escapedPlaylistId + ' WHERE timestamp=' + escapedDate + ';';

                connection.query(songsQuery + overviewQuery, (err, result) => {
                    connection.end();
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
