const {buildSchema} = require('graphql');

const schema = buildSchema(`
	type Mutation {
		addPlaylist(
			"the link in format: @user/playlists/@id"
			link: String!
		): PlaylistOverview
	}

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
    "Drop views after testing order by works as supposed to?"
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
