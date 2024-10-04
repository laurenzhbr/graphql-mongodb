// resourceController.js

const Resource = require('../models/ResourceModels/Resource'); // Importiere das Mongoose-Modell
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(Resource.schema.paths).filter(field => !field.startsWith('_')); // Entfernt interne Felder wie _id

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

        // Auswahl der Felder, die zurückgegeben werden sollen
        let selectFields = null;
        if (fields) {
            const requestedFields = fields.split(',').map((field) => field.trim());

            // Überprüfen, ob ungültige Felder abgefragt wurden
            const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                return res.status(400).json({
                message: `Invalid field(s) requested: ${invalidFields.join(', ')}`                });
            }

            // Nur First-Level-Felder auswählen
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
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
            .select(selectFields)
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


exports.createResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);

        // Verwende runValidators und validateBeforeSave
        await resource.save();

        res.status(201).json(resource);
    } catch (err) {
        if (err.name === 'MongoServerError' && err.message === 'Document failed validation') {
            return res.status(400).json({
                message: 'Validation Error: Document failed validation',
            });
        }
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen Ressource
exports.getResourceById = async (req, res) => {
    try {
      const { id } = req.params;
        const {fields} = req.query

        // Auswahl der Felder, die zurückgegeben werden sollen
        let selectFields = null;
        if (fields) {
            const requestedFields = fields.split(',').map((field) => field.trim());

            // Überprüfen, ob ungültige Felder abgefragt wurden
            const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    //message: `Invalid field(s) requested: ${invalidFields.join(', ')}. Allowed fields are: ${allowedFields.join(', ')}`
                    message: `Invalid field(s) requested: ${invalidFields.join(', ')}`

                });
            }

            // Nur First-Level-Felder auswählen
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
        }

        const resource = await Resource.findById(id).select(selectFields);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found with the specified criteria' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.patchResourceById = async (req, res) => {
    try {
      const { id } = req.params;  // ID der Organisation aus den URL-Parametern
      const updateData = req.body; // Die Daten, die aktualisiert werden sollen
  
      // Überprüfen, ob die zu aktualisierenden Daten im Body vorhanden sind
      if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({ success: false, message: 'No data for PATCH' });
      }
  
      // Finde die Organisation basierend auf der ID
      const resource = await Resource.findById(id);
  
      if (!resource) {
        return res.status(404).json({ success: false, message: 'DigitalIdentity not found.' });
      }
  
      // Aktualisiere nur die übermittelten Felder
      Object.assign(resource, updateData);
  
      // Speichere das Dokument, damit Pre-save-Hooks ausgeführt werden
      const updatedResource = await resource.save();
  
      // Erfolgreiches Update
      res.status(200).json(
        updatedResource
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
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