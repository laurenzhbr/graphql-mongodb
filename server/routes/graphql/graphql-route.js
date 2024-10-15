const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../graphql/schema');

//graphql-route.js
const router = express.Router();

// expose /graphql endpoint
router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));

module.exports = router;