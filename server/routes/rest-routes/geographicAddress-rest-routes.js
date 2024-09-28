const express = require('express');
const router = express.Router();
const geoAddressController = require('../../controller/geoAddressController'); // Importiere den Controller

// GET /geographicAddress - Alle GeographicAddress abrufen
router.get('/', geoAddressController.getGeoAddressList);

// POST /geographicAddress - Eine neue GeographicAddress erstellen
router.post('/', geoAddressController.createGeoAddress);

// GET /geographicAddress/:id - Eine spezifische v abrufen
router.get('/:id', geoAddressController.getGeoAddressById);

// Patch /geographicAddress - Eine GeographicAddress updaten
router.patch('/:id', geoAddressController.patchGeoAddressById)

// DELETE /geographicAddress/:id - Löschen einer GeographicAddress
router.delete('/:id', geoAddressController.deleteGeoAddressById);

module.exports = router;