const GeoAddress = require('../models/GeographicAddressModels/GeographicAddress');
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(GeoAddress.schema.paths).filter(field => !field.startsWith('_')); // Entfernt interne Felder wie _id


// Controller-Funktion zum Abrufen aller GeoAdressen
exports.getGeoAddressList = async (req, res) => {
    try {
        const { offset = 0, limit = 10, fields, sort = "id", ...filters } = req.query;

        // Offset and Limit for Pagination
        const skip = parseInt(offset, 10);
        const limitVal = parseInt(limit, 10);

        // field and direction for sorting
        const sortField = sort ? sort.replace('-', '') : 'id';
        const sortDirection = sort && sort.startsWith('-') ? -1 : 1; // -1 => desc , 1 => asc

        // attribute selection functionality
        let selectFields = null;
        if (fields) {
            const requestedFields = fields.split(',').map((field) => field.trim());

            // Check, if invalid fields are requested
            const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    message: `Invalid field(s) requested: ${invalidFields.join(', ')}`
                });
            }

            // only first-level attribute selection
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
        }

        const filterObj = { ...filters };

        // Get X-Total-Count
        const totalCount = await GeoAddress.countDocuments(filterObj);
        
        // fetch data from DB
        const geoAddresses = await GeoAddress.find(filterObj)
            .sort({ [sortField]: sortDirection })
            .select(selectFields)
            .skip(skip)
            .limit(limitVal)
        // Get X-Result-Count
        const resultCount = geoAddresses.length;
        
        // Header with x-Result-Count and x-Total-Count
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

// Controller for retrieving specific GeographicAddress
exports.getGeoAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const { fields } = req.query;

        // attribute selection functionality
        let selectFields = null;
        if (fields) {
            const requestedFields = fields.split(',').map((field) => field.trim());

            // Check, if invalid fields are requested
            const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                return res.status(400).json({
                    message: `Invalid field(s) requested: ${invalidFields.join(', ')}`
                });
            }

            // only first-level attribute selection
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
