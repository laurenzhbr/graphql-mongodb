const express = require('express');
const router = express.Router();
const partyController = require('../../controller/partyController'); // Importiere den Controller

// GET /organization - Alle Organization abrufen
router.get('/organization/', partyController.getOrganizationList);

// POST /organization - Eine neue Organization erstellen
router.post('/organization/', partyController.createOrganization);

// GET /organization/:id - Eine spezifische Organization abrufen
router.get('/organization/:id', partyController.getOrganizationById);

// Patch /organization - Eine Organization updaten
router.patch('/organization/:id', partyController.patchOrganizationById)

// DELETE /organization/:id - Löschen einer Organization
router.delete('/organization/:id', partyController.deleteOrganzationById);

module.exports = router;