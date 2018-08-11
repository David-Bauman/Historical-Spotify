const express = require('express');
const express_graphql = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const rootResolver = require('./resolver/resolver');

const app = express();

app.use(cors());

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true
}));

app.listen(4000, () => console.log('Server now running on localhost:4000'));
