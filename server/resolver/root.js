const {getHistoricalPlaylist, getMostRecentPlaylist, getPlaylists} = require('./query');
const {addPlaylist, refreshToken, codeToToken, userAuth, logUser} = require('./mutation');

const rootResolver = {
    historicalPlaylist: getHistoricalPlaylist,
    mostRecentPlaylist: getMostRecentPlaylist,
    playlists: getPlaylists,
    refreshToken: refreshToken,
    codeToToken: codeToToken,
    userAuth: userAuth,
    logUser: logUser,
    addPlaylist: addPlaylist,
};

module.exports = rootResolver;
