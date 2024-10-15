const express = require('express');
const router = express.Router();
const partyController = require('../../controller/partyController'); // Importiere den Controller

// GET /organization - Retrieve List of Organization 
router.get('/organization/', partyController.getOrganizationList);

// POST /organization - Create new Organization
router.post('/organization/', partyController.createOrganization);

// GET /organization/:id - Retrieve specific Organization
router.get('/organization/:id', partyController.getOrganizationById);

// Patch /organization - Partialy Update specific Organization
router.patch('/organization/:id', partyController.patchOrganizationById)

// DELETE /organization/:id - Delete specific Organization
router.delete('/organization/:id', partyController.deleteOrganzationById);

module.exports = router;