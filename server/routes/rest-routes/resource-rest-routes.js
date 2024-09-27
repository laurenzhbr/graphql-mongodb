const express = require('express');
const router = express.Router();
const resourceController = require('../../controller/resourceController')

// GET /resource - Alle Ressourcen abrufen
router.get('/', resourceController.getResourceList);

// POST /resource - Eine neue Ressource erstellen
router.post('/', resourceController.createResource);

// GET /resource/:id - Eine spezifische Ressource abrufen
router.get('/:id', resourceController.getResourceById);

// PATCH /resource/:id - Eine Ressource aktualisieren
router.patch('/:id', resourceController.patchResourceById);

// DELETE /resource/:id - Eine Ressource löschen
router.delete('/:id', resourceController.deleteResourceById);

module.exports = router;