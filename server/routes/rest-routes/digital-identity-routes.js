const express = require('express');
const router = express.Router();
const digitalIdentityController = require('../../controller/digitalIdentityController'); // Importiere den Controller

// GET /resource - Alle DigitalIdentities abrufen
router.get('/', digitalIdentityController.getDigitalIdentities);

// POST /resource - Eine neue DigitalIdentity erstellen
router.post('/', digitalIdentityController.createDigitalIdentity);

// GET /resource/:id - Eine spezifische DigitalIdentity abrufen
router.get('/:id', digitalIdentityController.getDigitalIdentityById);

// Patch /resource - Eine DigitalIdentity updaten
router.patch('/:id', digitalIdentityController.patchDigitalIdentity)

// DELETE /resource/:id - Löschen einer DigitalIdentity
router.delete('/:id', digitalIdentityController.deleteDigitalIdentityById);

module.exports = router;