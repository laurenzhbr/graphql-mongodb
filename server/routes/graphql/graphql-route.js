const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../graphql/schema'); // Importiere das Hauptschema

const router = express.Router();

// Stelle den GraphQL-Endpoint zur Verfügung
router.use('', graphqlHTTP({
    schema: schema, // Nutze das definierte Schema
    graphiql: true, // Aktiviere GraphiQL für Tests
  }));

module.exports = router;