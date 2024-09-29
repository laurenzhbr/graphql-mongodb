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

module.exports = router;