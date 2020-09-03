const express = require('express');
const express_graphql = require('express-graphql');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const rootResolver = require('./resolver/root');
const schema = require('./schema');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: rootResolver,
  graphiql: false
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
