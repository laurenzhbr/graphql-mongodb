const GeoAddress = require('../models/GeographicAddressModels/GeographicAddress');
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(GeoAddress.schema.paths).filter(field => !field.startsWith('_')); // Entfernt interne Felder wie _id


// Controller-Funktion zum Abrufen aller GeoAdressen
exports.getGeoAddressList = async (req, res) => {
    try {
        // URL-Query-Parameter
        const { offset = 0, limit = 10, fields, sort = "id", ...filters } = req.query;

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
                    message: `Invalid field(s) requested: ${invalidFields.join(', ')}. Allowed fields are: ${allowedFields.join(', ')}`
                });
            }

            // Nur First-Level-Felder auswählen
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
        }

        const filterObj = { ...filters };

        // Get X-Total-Count
        const totalCount = await GeoAddress.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        const geoAddresses = await GeoAddress.find(filterObj)
            .sort({ [sortField]: sortDirection })
            .select(selectFields)
            .skip(skip)
            .limit(limitVal)
        // Get X-Result-Count
        const resultCount = geoAddresses.length;
        
        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        if (offset == 0 && limit == 0){
        res.status(200).json(geoAddresses)
        } else if (resultCount == 0 ){
            res.status(404).json({message: "No results found"})
        } else  {
            res.status(206).json(geoAddresses)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen GeoAdresse
exports.getGeoAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const { fields } = req.query;

        // Auswahl der Felder, die zurückgegeben werden sollen
        let selectFields = null;
        if (fields) {
            const requestedFields = fields.split(',').map((field) => field.trim());

            // Überprüfen, ob ungültige Felder abgefragt wurden
            const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    message: `Invalid field(s) requested: ${invalidFields.join(', ')}. Allowed fields are: ${allowedFields.join(', ')}`
                });
            }

            // Nur First-Level-Felder auswählen
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
        }

        const geoAddress = await GeoAddress.findById(id).select(selectFields);
        if (!geoAddress) {
            return res.status(404).json({ message: 'GeoAddress not found with the specified criteria' });
        }
        res.status(200).json(geoAddress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
