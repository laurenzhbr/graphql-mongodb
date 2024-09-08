const express = require('express');
const router = express.Router();
const digitalIdentityController = require('../../controller/digitalIdentityController'); // Importiere den Controller

// GET /resource - Alle DigitalIdentities abrufen
router.get('/', digitalIdentityController.getDigitalIdentities);

// POST /resource - Eine neue DigitalIdentity erstellen
router.post('/', digitalIdentityController.createDigitalIdentity);

// GET /resource/:id - Eine spezifische DigitalIdentity abrufen
router.get('/:id', digitalIdentityController.getDigitalIdentityById);

module.exports = router;


/* // PATCH /resource/:id - Eine Ressource aktualisieren
router.patch('/:id', async (req, res) => {
    try {
        // `req.params.id` enthält die ID der Ressource, die aktualisiert werden soll
        // `req.body` enthält die neuen Daten, die die entsprechenden Felder aktualisieren sollen
        const updatedParty = await DigitalIdentity.findByIdAndUpdate(
            req.params.id,            // Die ID der Ressource
            req.body,                 // Die neuen Daten, die aktualisiert werden sollen
            { new: true, runValidators: true }  // Optionen: `new: true` gibt das aktualisierte Dokument zurück; `runValidators: true` validiert die neuen Daten gemäß dem Schema
        );

        // Falls die Ressource nicht gefunden wurde, gibt `findByIdAndUpdate` `null` zurück
        if (!updatedParty) {
            return res.status(404).json({ message: 'DigitalIdentity not found' });
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
        await DigitalIdentity.findByIdAndDelete(req.params.id);
        res.json({ message: 'DigitalIdentity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
 
module.exports = router;*/