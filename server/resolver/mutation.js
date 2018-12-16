const {spawn} = require('child_process');
const querystring = require('querystring');
const rp = require('request-promise');
const fs = require('fs');
const connect = require('./../db_auth').connect;

const clientInfo = fs.readFileSync('./../scripts/auth_options.txt').toString().split('\n');
const clientID = clientInfo[0];
const clientSecret = clientInfo[1];
const redirectURI = 'https://bauman.zapto.org/HistoricalPlaylists';

const runCreatePlaylist = ({link}) => new Promise((resolve, reject) => {
	const pythonProgram = spawn('python3', [__dirname + '/../../scripts/create_playlist.py', [link]]);

	pythonProgram.stdout.on('data', data => {
		const string = String.fromCharCode.apply(null, data).replace(/'/g, '"').replace(/\\\\"/g, '\'');
		const result = JSON.parse(string);
		console.log(result);
		resolve(result);
	});
	pythonProgram.stderr.on('data', data => reject(String.fromCharCode.apply(null, data)));
});

const userAuthRedirect = () => new Promise((resolve, reject) => {
  resolve({url: 'https://accounts.spotify.com/authorize?' +
   querystring.stringify({
     response_type: 'code',
     client_id: clientID,
     scope: 'streaming user-read-birthdate user-read-email user-read-private user-modify-playback-state',
     redirect_uri: redirectURI
   })
  });
});

const codeToToken = ({code}) => new Promise((resolve, reject) => {
  rp({
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    form: {
      'code': code,
      'grant_type': 'authorization_code',
      'redirect_uri': redirectURI
    },
    json: true,
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
    }
  }).then(data => resolve(data)).catch(err => {console.log(err); reject(err)});
});

const logUser = ({name}) => {
  const connection = connect();
  return new Promise((resolve, reject) => {
	connection.connect(err => {
	  if (err) reject(err);
      const escapedName = connection.escape(name);
	  connection.query(
	    'INSERT INTO hs_users.users (name, logins) VALUES (' + escapedName + ', 1) ON DUPLICATE KEY UPDATE logins=logins+1;',
		(err, result) => {
          connection.end();
		  if (err) reject(err);
		  resolve();
        }
      );
    });
  });
}

const refreshToken = ({code}) => new Promise((resolve, reject) => {
  rp({
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    json: true,
    form: {
      'refresh_token': code,
      'grant_type': 'refresh_token',
    },
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
    }
  }).then(data => resolve(data)).catch(err => {console.log(err); reject(err)});
});

module.exports = {
	addPlaylist: runCreatePlaylist,
    refreshToken: refreshToken,
    codeToToken: codeToToken,
    userAuth: userAuthRedirect,
    logUser: logUser,
};
