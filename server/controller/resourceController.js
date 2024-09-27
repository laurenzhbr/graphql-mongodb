// resourceController.js

const Resource = require('../models/ResourceModels/Resource'); // Importiere das Mongoose-Modell

exports.getResourceList = async (req, res) => {
    try {

        // URL-Query-Parameter
        const { offset = 0, limit = 0, fields, sort = "id", ...filters } = req.query;

        // Offset und Limit für Pagination
        const skip = parseInt(offset, 10);
        const limitVal = parseInt(limit, 10);

        // Setze das Sortierfeld und -richtung inline
        const sortField = sort ? sort.replace('-', '') : 'id'; // Entferne '-' wenn vorhanden
        const sortDirection = sort && sort.startsWith('-') ? -1 : 1; // -1 für absteigend, 1 für aufsteigend

        // Fields für die Projektion (nur First-Level-Attribute erlaubt)
        let selectedFields = null;
        if (fields) {
          selectedFields = fields
            .split(',')
            .map((field) => field.trim())
            .filter((field) => !field.includes('.')) // Nur First-Level-Felder
            .join(' ');
        }

        // Create the filter object for MongoDB queries
        const filterObj = { ...filters };

        // Dynamisches Filtern der resourceCharacteristics
        const characteristicsFilter = [];

        for (const key in filters) {
            if (filters.hasOwnProperty(key) && key.includes('.')) {
                const operatorMatch = key.match(/(gt|lt|gte|lte)$/); // Erkennung von Vergleichsoperatoren
                const operator = operatorMatch ? operatorMatch[0] : null;
                const value = filters[key].replace(operator, '');

                // Mapping der Operatoren zu MongoDB
                const mongoOperator = operator === 'gt' ? '$gt'
                    : operator === 'lt' ? '$lt'
                    : operator === 'gte' ? '$gte'
                    : operator === 'lte' ? '$lte'
                    : null;

                // Hinzufügen des Filters für die spezifische Characteristic
                if (mongoOperator) {
                    characteristicsFilter.push({
                        $elemMatch: {
                            name: key.replace(`.${operator}`, ''), // Entferne den Operator aus dem Namen
                            value: { [mongoOperator]: parseInt(value, 10) }
                        }
                    });
                } else {
                    characteristicsFilter.push({
                        $elemMatch: {
                            name: key,
                            value: filters[key]
                        }
                    });
                }
              delete filterObj[key];
            }
        }

        // Wenn es dynamische Characteristics-Filter gibt, dann füge sie zu filterObj hinzu
        if (characteristicsFilter.length > 0) {
            filterObj['resourceCharacteristic'] = { $all: characteristicsFilter };
        }
        
        // Get X-Total-Count
        const totalCount = await Resource.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        const resources = await Resource.find(filterObj)
            .sort({ [sortField]: sortDirection })
            .select(selectedFields)
            .skip(skip)
            .limit(limitVal)
        
        // Get X-Result-Count
        const resultCount = resources.length;

        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        if (offset == 0 && limit == 0){
          res.status(200).json(resources)
        } else if (resultCount == 0 ){
          res.status(404).json({message: "No results found"})
        } else  {
          res.status(206).json(resources)
        }
    } catch (err) {
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
      const { id } = req.params;
        const {fields} = req.query

        // Auswahl der Felder, die zurückgegeben werden sollen
        let selectedFields = null;
        if (fields) {
          selectedFields = fields
            .split(',')
            .map((field) => field.trim())
            .filter((field) => !field.includes('.')) // Nur First-Level-Felder
            .join(' ');
        }

        const resource = await Resource.findById(id).select(selectedFields);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found with the specified criteria' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Aktualisieren einer Ressource
exports.patchResourceById = async (req, res) => {
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
      const { id } = req.params;

      // Suche und lösche die Resource anhand der ID
      const deletedResource = await Resource.findByIdAndDelete(id);

      // Falls die Resource nicht gefunden wurde
      if (!deletedResource) {
          return res.status(404).json({ message: `Resource mit ID ${id} nicht gefunden.` });
      }

      // Erfolgreich gelöscht
      res.status(204).json();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};