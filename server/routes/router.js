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
        </style>
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
      </body>
    </html>
  `);
});



module.exports = router;