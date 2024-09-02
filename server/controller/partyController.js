// partyController.js

const Organization = require('../models/PartyModels/Organization');

// Controller-Funktion zum Abrufen aller Ressourcen
exports.getAllParties = async (req, res) => {
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

        const parties = await Organization.find(filters).select(fields);
        res.json(parties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen Ressource
exports.createParty = async (req, res) => {
    const party = new Organization({
        //href-Attribute wird von alleine gesetzt
        category: req.body.category,
        name: req.body.name,
        description: req.body.description,
        endOperatingDate: req.body.endOperatingDate,
        startOperatingDate: req.body.startOperatingDate,
    });

    try {
        const newParty = await party.save();
        res.status(201).json(newParty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen Ressource
exports.getPartyById = async (req, res) => {
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

        const party = await Organization.findOne(filters).select(fields);
        if (!party) {
            return res.status(404).json({ message: 'Resource not found with the specified criteria' });
        }
        res.json(party);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
