const express = require('express');
const router = express.Router();
const geoAddressController = require('../../controller/geoAdressController'); // Importiere den Controller

// GET /resource - Alle GeoAdressen abrufen
router.get('/', geoAddressController.getAllGeoAddresses);

// POST /resource - Eine neue GeoAdresse erstellen
router.post('/', geoAddressController.createGeoAddress);

// GET /resource/:id - Eine spezifische GeoAdresse abrufen
router.get('/:id', geoAddressController.getGeoAddressById);

module.exports = router;
/* // PATCH /resource/:id - Eine Ressource aktualisieren
router.patch('/:id', async (req, res) => {
    try {
        // `req.params.id` enthält die ID der Ressource, die aktualisiert werden soll
        // `req.body` enthält die neuen Daten, die die entsprechenden Felder aktualisieren sollen
        const updatedGeoAdress = await GeographicAdress.findByIdAndUpdate(
            req.params.id,            // Die ID der Ressource
            req.body,                 // Die neuen Daten, die aktualisiert werden sollen
            { new: true, runValidators: true }  // Optionen: `new: true` gibt das aktualisierte Dokument zurück; `runValidators: true` validiert die neuen Daten gemäß dem Schema
        );

        // Falls die Ressource nicht gefunden wurde, gibt `findByIdAndUpdate` `null` zurück
        if (!updatedGeoAdress) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Erfolgreiche Aktualisierung, das aktualisierte Dokument wird zurückgegeben
        res.json(updatedGeoAdress);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /resource/:id - Eine Ressource löschen
router.delete('/:id', async (req, res) => {
    try {
        await GeoAdress.findByIdAndDelete(req.params.id);
        res.json({ message: 'GeoAdress deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; */