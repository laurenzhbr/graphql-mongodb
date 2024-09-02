const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');

// Controller-Funktion zum Abrufen aller DigitalIdentities
exports.getAllDigitalIdentities = async (req, res) => {
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

        const digitalIdentities = await DigitalIdentity.find(filters).select(fields);
        res.json(digitalIdentities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen DigitalIdentity
exports.createDigitalIdentity = async (req, res) => {
    const digitalIdentity = new DigitalIdentity({
        // href-Attribut wird automatisch gesetzt
        category: req.body.category,
        name: req.body.name,
        description: req.body.description,
        endOperatingDate: req.body.endOperatingDate,
        startOperatingDate: req.body.startOperatingDate,
    });

    try {
        const newDigitalIdentity = await digitalIdentity.save();
        res.status(201).json(newDigitalIdentity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen DigitalIdentity
exports.getDigitalIdentityById = async (req, res) => {
    try {
        const filters = { _id: req.params.id };

        // Auswahl der Felder, die zurückgegeben werden sollen
        let fields = null;

        const digitalIdentity = await DigitalIdentity.findOne(filters).select(fields);
        if (!digitalIdentity) {
            return res.status(404).json({ message: 'DigitalIdentity not found with the specified criteria' });
        }
        res.json(digitalIdentity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
