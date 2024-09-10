// partyController.js

const Organization = require('../models/PartyModels/Organization');

// Controller-Funktion zum Abrufen aller Ressourcen
exports.getAllParties = async (req, res) => {
    try {
        // URL-Query-Parameter
        const { offset = 0, limit = 100, fields, sortBy, creditRating_gt, ...filters } = req.query;

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
        // Füge creditRating_gt zum Filter hinzu, falls vorhanden
        const filterObj = {
            ...filters,
            ...(creditRating_gt && { 'creditRating.ratingScore': { $gt: parseInt(creditRating_gt) } })
        };

        // Get X-Total-Count
        const totalCount = await Organization.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        let query = Organization.find(filterObj)
          .select(selectedFields)
          .skip(skip);
          

        // Sortiere nach creditRating.ratingScore, wenn sortBy angegeben ist
        query = sortBy ? query.sort({ 'creditRating.ratingScore': sortBy === 'asc' ? 1 : -1 }) : query;

        // Führe die Abfrage aus
        const organizations = await query.limit(limitVal);
        
        // Get X-Result-Count
        const resultCount = organizations.length;

        // Wenn keine Organisationen gefunden werden
        if (resultCount === 0) {
            return res.status(404).json({ message: 'No organizations found for matching criteria' });
        }

        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        res.status(200).json(organizations);
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
