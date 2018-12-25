# Historical Spotify

[![GitHub Issues](https://img.shields.io/github/issues/David-Bauman/Historical-Spotify.svg)](https://github.com/David-Bauman/Historical-Spotify/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-green.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

##### Client Dependencies
[![Dependency Status](https://david-dm.org/david-bauman/historical-spotify.svg?path=client)](https://david-dm.org/david-bauman/historical-spotify?path=client)

##### Server Dependencies
[![Dependency Status](https://david-dm.org/david-bauman/historical-spotify.svg?path=server)](https://david-dm.org/david-bauman/historical-spotify?path=server)

This is the repository for the client, server, and script code of [Historical Spotify](https://bauman.zapto.org/HistoricalPlaylists/).

## Goals

Historical Spotify keeps track of the state of Spotify playlists as they change over time. Users can see how their favorite playlists have changed over time and find new songs, begin automatic collection of data on a new playlist, and stream music they find through the website.

## How It Works

[Scripts](https://github.com/David-Bauman/Historical-Spotify/tree/master/scripts) run at set time intervals to determine what, if anything, has changed in the playlists we're watching. All information is stored in MySQL databases. A [Express server](https://github.com/David-Bauman/Historical-Spotify/tree/master/server) exposes the API so that the [client](https://github.com/David-Bauman/Historical-Spotify/tree/master/client) can have up to the moment information. 

## To Do

- <s>Change REST endpoints to GraphQL</s>
- <s>Remove code from history bar to avoid page reloads with the same code</s>

