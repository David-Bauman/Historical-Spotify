const {getHistoricalPlaylist, getMostRecentPlaylist, getPlaylists} = require('./query');
const {addPlaylist, refreshToken, codeToToken, userAuth} = require('./mutation');

const rootResolver = {
	historicalPlaylist: getHistoricalPlaylist,
	mostRecentPlaylist: getMostRecentPlaylist,
	playlists: getPlaylists,
    refreshToken: refreshToken,
    codeToToken: codeToToken,
    userAuth: userAuth,
	addPlaylist: addPlaylist,
};

module.exports = rootResolver;
