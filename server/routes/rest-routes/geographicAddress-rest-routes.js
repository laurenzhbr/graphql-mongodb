const express = require('express');
const router = express.Router();
const geoAddressController = require('../../controller/geoAddressController'); // Importiere den Controller

// GET /geographicAddress - Retrieve List of GeographicAddress
router.get('/geographicAddress/', geoAddressController.getGeoAddressList);

// GET /geographicAddress/:id - Retrieve specific GeographicAddress
router.get('/geographicAddress/:id', geoAddressController.getGeoAddressById);

module.exports = router;