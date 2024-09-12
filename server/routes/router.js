// import required packages
const express = require('express');
const createError = require('http-errors');

// import all REST Endpoints
const restResourceRoutes = require('./rest-routes/resource-rest-routes')
const restPartyRoutes = require('./rest-routes/party-rest-routes')
const restGeoAdressRoutes = require('./rest-routes/geographicAdress-rest-routes')
const restResourceCatalogRoutes = require('./rest-routes/resourceCatalog-rest-routes')
const restDigitalIdentityRoutes = require('./rest-routes/digital-identity-routes')

// Import GraphQL endpoint
const graphqlRouter = require('./graphql/graphql-route')

const router = express.Router();

//GraphQL route
router.use('/graphql', graphqlRouter)


// REST routes
router.use('/resourceInventoryManagement/resource', restResourceRoutes)
router.use('/partyManagement/organization', restPartyRoutes)
router.use('/geographicAdressManagement/geographicAdress', restGeoAdressRoutes)
router.use('/resourceCatalog/resourceSpecification', restResourceCatalogRoutes)
router.use('/digitalIdentityManagement/digitalIdentity', restDigitalIdentityRoutes)
// Health-check-Endpunkt
router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

/* // Show 404 if no router is connected
router.use('*', (req, res, next) => {
    next(createError(404))
  }); */

module.exports = router;