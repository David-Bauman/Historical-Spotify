const express = require('express');
const express_graphql = require('express-graphql');
const querystring = require('querystring');
const cors = require('cors');
const rp = require('request-promise');
const fs = require('fs');
const https = require('https');
const rootResolver = require('./resolver/resolver');
const schema = require('./schema');

const clientInfo = fs.readFileSync('./../scripts/auth_options.txt').toString().split('\n');
const clientID = clientInfo[0];
const clientSecret = clientInfo[1];

const app = express();

app.use(cors());
app.use(express.json());

app.get('/userAuthRedirect', (req, res) => {
  res.json({url: 'https://accounts.spotify.com/authorize?' +
   querystring.stringify({
     response_type: 'code',
     client_id: clientID,
     scope: 'streaming user-read-birthdate user-read-email user-read-private user-modify-playback-state',
     redirect_uri: 'https://bauman.zapto.org/HistoricalPlaylists'
   })
 });
});

app.post('/codeToToken', (req, res) => {
  rp({
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    form: {
      'code': req.body.code,
      'grant_type': 'authorization_code',
      'redirect_uri': 'https://bauman.zapto.org/HistoricalPlaylists'
    },
    json: true,
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
    }
  }).then(data => res.json(data)).catch(err => console.log(err));
});

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true
}));

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/bauman.zapto.org/privkey.pem', 'utf-8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bauman.zapto.org/cert.pem', 'utf-8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/bauman.zapto.org/chain.pem', 'utf-8'),
};

const server = https.createServer(options, app)

server.listen(4000, () => {
    console.log('Listening on https://bauman.zapto.org:4000')
});
