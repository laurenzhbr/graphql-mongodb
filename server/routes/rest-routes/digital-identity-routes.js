const express = require('express');
const router = express.Router();
const digitalIdentityController = require('../../controller/digitalIdentityController'); // Importiere den Controller

// GET /resource - Retrieve List of DigitalIdentities
router.get('/digitalIdentity/', digitalIdentityController.getDigitalIdentities);

// POST /resource - Create new DigitalIdentity
router.post('/digitalIdentity/', digitalIdentityController.createDigitalIdentity);

// GET /resource/:id - Retrieve specific DigitalIdentity
router.get('/digitalIdentity/:id', digitalIdentityController.getDigitalIdentityById);

// Patch /resource - Partialy Update specific DigitalIdentity
router.patch('/digitalIdentity/:id', digitalIdentityController.patchDigitalIdentity)

// DELETE /resource/:id - Delete specific DigitalIdentity
router.delete('/digitalIdentity/:id', digitalIdentityController.deleteDigitalIdentityById);

module.exports = router;