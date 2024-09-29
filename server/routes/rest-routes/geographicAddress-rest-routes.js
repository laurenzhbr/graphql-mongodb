const express = require('express');
const router = express.Router();
const geoAddressController = require('../../controller/geoAddressController'); // Importiere den Controller

// GET /geographicAddress - Alle GeographicAddress abrufen
router.get('/geographicAddress/', geoAddressController.getGeoAddressList);

// GET /geographicAddress/:id - Eine spezifische v abrufen
router.get('/geographicAddress/:id', geoAddressController.getGeoAddressById);

module.exports = router;