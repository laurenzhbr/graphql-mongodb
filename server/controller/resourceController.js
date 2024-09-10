// resourceController.js

const Resource = require('../models/ResourceModels/Resource'); // Importiere das Mongoose-Modell

exports.getAllResources = async (req, res) => {
    try {

        // URL-Query-Parameter
        const { offset = 0, limit = 100, fields, current_capacity_usage, ...filters } = req.query;

        // Offset und Limit für Pagination
        const skip = parseInt(offset, 10);
        const limitVal = parseInt(limit, 10);

        // Fields für die Projektion (nur First-Level-Attribute erlaubt)
        let selectedFields = null;
        if (fields) {
          selectedFields = fields
            .split(',')
            .map((field) => field.trim())
            .filter((field) => !field.includes('.')) // Nur First-Level-Felder
            .join(' ');
        }

        const filterObj = { ...filters };

        // Falls ein Filter für `current_capacity_usage` angegeben wurde
        if (current_capacity_usage) {
            filterObj['resourceCharacteristic'] = {
              $elemMatch: {
                "name": "current_capacity_usage",
                "value": { $gt: parseInt(current_capacity_usage) }
              }
            };
        }

        // Get X-Total-Count
        const totalCount = await Resource.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        const resources = await Resource.find(filterObj)
          .select(selectedFields)
          .skip(skip)
          .limit(limitVal); 
        
        // Get X-Result-Count
        const resultCount = resources.length;

        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        res.json(resources);
    } catch (err) {
      console.log(err.message);  
      res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen Ressource
exports.createResource = async (req, res) => {
    const resource = new Resource(req.body);

    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen Ressource
exports.getResourceById = async (req, res) => {
    try {
        const filters = { _id: req.params.id };

        if (req.query.name) {
            filters.name = req.query.name;
        }
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.description) {
            filters.description = req.query.description;
        }

        // Auswahl der Felder, die zurückgegeben werden sollen
        let fields = null;
        if (req.query.fields) {
            fields = req.query.fields.split(',').join(' ');
        }

        const resource = await Resource.findOne(filters).select(fields);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found with the specified criteria' });
        }
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Aktualisieren einer Ressource
exports.updateResourceById = async (req, res) => {
    try {
        const { id } = req.params; // ID des Street-Cabinets
        const { newRelatedParty } = req.body; // Neue relatedParty-Daten (ID und andere Details)

        // Finde das Street-Cabinet basierend auf der ID
        const streetCabinet = await Resource.findById(id);

        if (!streetCabinet) {
        return res.status(404).json({ message: 'Resource nicht gefunden' });
        }

        // Überprüfe, ob eine relatedParty vorhanden ist und ersetze diese durch die neue Party
        streetCabinet.relatedParty = streetCabinet.relatedParty.map(party =>
        party.id === newRelatedParty.oldPartyId
            ? { ...party.toObject(), id: newRelatedParty.newPartyId, name: newRelatedParty.newPartyName, href: newRelatedParty.newPartyHref }
            : party
        );

        // Speichere die aktualisierten Daten (presave-Hook wird ausgeführt)
        const updatedStreetCabinet = await streetCabinet.save();

        // Rückgabe des aktualisierten Street-Cabinet-Datensatzes
        res.status(200).json(updatedStreetCabinet);

    } catch (error) {
        console.error('Error updating relatedParty:', error);
        res.status(500).json({ message: 'Interner Serverfehler' });
    }
};

// Controller-Funktion zum Löschen einer Ressource
exports.deleteResourceById = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};