const express = require('express');
const router = express.Router();
const partyController = require('../../controller/partyController'); // Importiere den Controller

// GET /organization - Alle Organization abrufen
router.get('/', partyController.getOrganizationList);

// POST /organization - Eine neue Organization erstellen
router.post('/', partyController.createOrganization);

// GET /organization/:id - Eine spezifische Organization abrufen
router.get('/:id', partyController.getOrganizationById);

// Patch /organization - Eine Organization updaten
router.patch('/:id', partyController.patchOrganizationById)

// DELETE /organization/:id - Löschen einer Organization
router.delete('/:id', partyController.deleteOrganzationById);

module.exports = router;