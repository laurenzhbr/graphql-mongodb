const GeoAddress = require('../models/GeoAdressModels/GeographicAdress');

// Controller-Funktion zum Abrufen aller GeoAdressen
exports.getAllGeoAddresses = async (req, res) => {
    try {
        const filters = {};

        if (req.query.name) {
            filters.name = req.query.name;
        }
        if (req.query.category) {
            filters.category = req.query.category;
        }
        if (req.query.description) {
            filters.description = req.query.description;
        }
        if (req.query.startOperatingDate) {
            filters.startOperatingDate = { $gte: new Date(req.query.startOperatingDate) };
        }
        if (req.query.endOperatingDate) {
            filters.endOperatingDate = { $lte: new Date(req.query.endOperatingDate) };
        }

        // Auswahl der Felder, die zurückgegeben werden sollen
        let fields = null;
        if (req.query.fields) {
            fields = req.query.fields.split(',').join(' ');
        }

        const geoAddresses = await GeoAddress.find(filters).select(fields);
        res.json(geoAddresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen GeoAdresse
exports.createGeoAddress = async (req, res) => {
    const geoAddress = new GeoAddress({
        // href-Attribut wird automatisch gesetzt
        category: req.body.category,
        name: req.body.name,
        description: req.body.description,
        endOperatingDate: req.body.endOperatingDate,
        startOperatingDate: req.body.startOperatingDate,
    });

    try {
        const newGeoAddress = await geoAddress.save();
        res.status(201).json(newGeoAddress);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen GeoAdresse
exports.getGeoAddressById = async (req, res) => {
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

        const geoAddress = await GeoAddress.findOne(filters).select(fields);
        if (!geoAddress) {
            return res.status(404).json({ message: 'GeoAddress not found with the specified criteria' });
        }
        res.json(geoAddress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
