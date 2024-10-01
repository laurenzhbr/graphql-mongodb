// import required packages
const express = require('express');

// import all REST Endpoints
const restResourceRoutes = require('./rest-routes/resource-rest-routes')
const restPartyRoutes = require('./rest-routes/party-rest-routes')
const restGeoAddressRoutes = require('./rest-routes/geographicAddress-rest-routes')
const restDigitalIdentityRoutes = require('./rest-routes/digital-identity-routes')

// Import GraphQL endpoint
const graphqlRouter = require('./graphql/graphql-route')

const router = express.Router();

//GraphQL route
router.use('/graphql', graphqlRouter)

// REST routes
router.use('/resourceInventoryManagement', restResourceRoutes)
router.use('/partyManagement', restPartyRoutes)
router.use('/geographicAddressManagement', restGeoAddressRoutes)
router.use('/digitalIdentityManagement', restDigitalIdentityRoutes)
// Health-check-Endpunkt
router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Route für den Entry-Point "/"
// Route für den Entry-Point "/"
router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API Endpoints</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #333;
          }
          h2 {
            color: #555;
            margin-top: 30px;
          }
          div {
            margin-bottom: 20px;
          }
          a {
            text-decoration: none;
            color: #007BFF;
          }
          a:hover {
            text-decoration: underline;
          }
          .note {
            font-size: 0.9em;
            color: #666;
            font-style: italic;
            margin-top: -10px;
          }
          h2 svg {
            margin-left: 10px;
            vertical-align: middle;
          }

        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      </head>
      <body>
        <h1>Available API Endpoints</h1>
        <br>
        <di>
          <h2>GraphQL</h2>
          <h4><a href="/graphql" target="_blank" style="color:#F740B4">GraphQL Playground</a></h4>
        </div>

        <div>
          <h2>REST</h2>
          <div>
          <h3>available REST-API endpoints </h3>
            <h4><a href="/resourceInventoryManagement" target="_blank">/resourceInventoryManagement</a>/resource</h4>
            <h4><a href="/partyManagement/" target="_blank">/partyManagement</a>/organization</h4>
            <h4><a href="/geographicAddressManagement/" target="_blank">/geographicAddressManagement</a>/geographicAddress</h4>
            <h4><a href="/digitalIdentityManagement/" target="_blank">/digitalIdentityManagement</a>/digitalIdentity</h4>
          </div>
          <div>
          <h3>Utils </h3>
            <p><a href="/api-docs" target="_blank">Swagger Documentation</a></p>
            <p><a href="/health-check" target="_blank">Health Check</a></p>
          </di>
        </div>
        <br>
        <div>
        <h2>Usability Survey</h2>
        <h4>🇬🇧 <a href="https://docs.google.com/forms/d/e/1FAIpQLScUvp4lQfkmrlq5FfyfPHihu6aTp4zASFiZilycdzKnFKu44Q/viewform?usp=sf_link">Usability Survey English Version</a></h4>
        <p class="note"> I personally recommend to use the english one, because the underlying data model (objects, relations, attributes) uses english language. <br> So, the descriptions of the use-cases are directly in the same language and don't have to be translated.
        <h4>🇩🇪 <a href="https://docs.google.com/forms/d/e/1FAIpQLSfxcLz-Fj9oTHRhnd-MS0XT0KjxiVQB75VfdW-Sp8IzSskTZg/viewform?usp=sf_link">Usability Survey Deutsche Version</a></h4>
        </div>
        <br>
        <div>
        <h2>
          GitHub
          <svg id="fi_2111432" enable-background="new 0 0 24 24" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z"></path>
          </svg>
        </h2>
        <h4><a href="https://github.com/laurenzhbr/graphql-mongodb/wiki/Data-Models">GitHub Wiki Page</a></h4>
        </div>
      </body>
    </html>
  `);
});



module.exports = router;