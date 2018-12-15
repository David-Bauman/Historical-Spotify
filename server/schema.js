const {buildSchema} = require('graphql');

const schema = buildSchema(`
  type Mutation {
	addPlaylist(
	  "the link in format: @user/playlists/@id"
	  link: String!
	): PlaylistOverview
    "returns URL for user to authorize spotify account"
    userAuth: URL
    "returns initial access token as well as a refresh token"
    codeToToken(
      "user token, gotten after user grants access from the userAuth url"
      code: String!
    ): Tokens
    "returns a new access token"
    refreshToken(
      "the refresh code that was generated off the codeToToken endpoint"
      code: String!
    ): Tokens
  },

  type Query {
    "Specific playlist information at time 'date'"
    historicalPlaylist(
      "Specific playlist id"
      id: String!
      "Must be in format YYYY-MM-DD HH:MM:SS"
      date: String!
    ): SpecificPlaylist
    "Information for initial specific playlist view"
    mostRecentPlaylist(
      "Specific playlist id"
      id: String!
    ): SpecificPlaylist
    "General overview information"
    playlists: [PlaylistOverview]
  },

  type URL {
    url: String
  }

  type Tokens {
    access_token: String
    refresh_token: String
  }

  type SpecificPlaylist {
    "YYYY-MM-DD HH:MM:SS strings of times where this playlist has information"
    possibleDates: [String!]
    "Basic information on the specific playlist"
    overview: PlaylistOverview
    songs: [Song!]
  },

  type PlaylistOverview {
    "YYYY-MM-DD format"
    createDate: String
    description: String
    id: String
    imageURL: String
    name: String
    user: String
    views: Int
  },

  type Song {
    album: String
    artists: String
    "The song's duration in ms"
    duration: Int
    songId: String
    name: String
  }
`);

module.exports = schema;
