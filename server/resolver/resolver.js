const {getHistoricalPlaylist, getMostRecentPlaylist, getPlaylists} = require('./query');
const {addPlaylist} = require('./mutation');

const rootResolver = {
	historicalPlaylist: getHistoricalPlaylist,
	mostRecentPlaylist: getMostRecentPlaylist,
	playlists: getPlaylists,
	addPlaylist: addPlaylist,
};

module.exports = rootResolver;