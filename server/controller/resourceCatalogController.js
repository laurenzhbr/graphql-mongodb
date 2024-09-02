const ResourceSpecification = require('../models/ResourceCatalogModels/ResourceSpecification');

// Controller-Funktion zum Abrufen aller Ressourcen
exports.getAllResourceSpecifications = async (req, res) => {
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

        const resources = await ResourceSpecification.find(filters).select(fields);
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen Ressource
exports.createResourceSpecification = async (req, res) => {
    const resource = new ResourceSpecification({
        // href-Attribut wird automatisch gesetzt
        category: req.body.category,
        name: req.body.name,
        description: req.body.description,
        endOperatingDate: req.body.endOperatingDate,
        startOperatingDate: req.body.startOperatingDate,
    });

    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller-Funktion zum Abrufen einer spezifischen Ressource
exports.getResourceSpecificationById = async (req, res) => {
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

        const resource = await ResourceSpecification.findOne(filters).select(fields);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found with the specified criteria' });
        }
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
