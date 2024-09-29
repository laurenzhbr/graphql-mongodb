const express = require('express');
const router = express.Router();
const resourceController = require('../../controller/resourceController')

// GET /resource - Alle Ressourcen abrufen
router.get('/resource/', resourceController.getResourceList);

// POST /resource - Eine neue Ressource erstellen
router.post('/resource/', resourceController.createResource);

// GET /resource/:id - Eine spezifische Ressource abrufen
router.get('/resource/:id', resourceController.getResourceById);

// PATCH /resource/:id - Eine Ressource aktualisieren
router.patch('/resource/:id', resourceController.patchResourceById);

// DELETE /resource/:id - Eine Ressource löschen
router.delete('/resource/:id', resourceController.deleteResourceById);

module.exports = router;