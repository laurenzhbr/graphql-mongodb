const express = require('express');
const router = express.Router();
const resourceSpecificationController = require('../../controller/resourceCatalogController'); // Importiere den Controller

// GET /resource - Alle Ressourcen abrufen
router.get('/', resourceSpecificationController.getAllResourceSpecifications);

// POST /resource - Eine neue Ressource erstellen
router.post('/', resourceSpecificationController.createResourceSpecification);

// GET /resource/:id - Eine spezifische Ressource abrufen
router.get('/:id', resourceSpecificationController.getResourceSpecificationById);

module.exports = router;

/* // PATCH /resource/:id - Eine Ressource aktualisieren
router.patch('/:id', async (req, res) => {
    try {
        // `req.params.id` enthält die ID der Ressource, die aktualisiert werden soll
        // `req.body` enthält die neuen Daten, die die entsprechenden Felder aktualisieren sollen
        const updatedParty = await ResourceSpecification.findByIdAndUpdate(
            req.params.id,            // Die ID der Ressource
            req.body,                 // Die neuen Daten, die aktualisiert werden sollen
            { new: true, runValidators: true }  // Optionen: `new: true` gibt das aktualisierte Dokument zurück; `runValidators: true` validiert die neuen Daten gemäß dem Schema
        );

        // Falls die Ressource nicht gefunden wurde, gibt `findByIdAndUpdate` `null` zurück
        if (!updatedParty) {
            return res.status(404).json({ message: 'Party not found' });
        }

        // Erfolgreiche Aktualisierung, das aktualisierte Dokument wird zurückgegeben
        res.json(updatedParty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /resource/:id - Eine Ressource löschen
router.delete('/:id', async (req, res) => {
    try {
        await ResourceSpecification .findByIdAndDelete(req.params.id);
        res.json({ message: 'Party deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; */