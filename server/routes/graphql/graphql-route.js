const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../graphql/schema'); // Importiere das Hauptschema

//graphql-route.js
const router = express.Router();
// expose /graphql endpoint
router.use('', graphqlHTTP({
    schema: schema, // Nutze das definierte Schema
    graphiql: true, // Aktiviere GraphiQL für Tests
  }));

module.exports = router;