const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');

// Controller-Funktion zum Abrufen aller DigitalIdentities
exports.getDigitalIdentities = async (req, res) => {
    try {
        // URL-Query-Parameter
        const { offset = 0, limit = 10, fields, ...filters } = req.query;

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

        // Get X-Total-Count
        const totalCount = await DigitalIdentity.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        const digitalIdentities = await DigitalIdentity.find(filterObj)
          .select(selectedFields)
          .skip(skip)
          .limit(limitVal); 
        
        // Get X-Result-Count
        const resultCount = digitalIdentities.length;

        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        /* if (req.query.name) {
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
        } */

        res.json(digitalIdentities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen DigitalIdentity
exports.createDigitalIdentity = async (req, res) => {
    const digitalIdentity = new DigitalIdentity(req.body);

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
        // Auswahl der Felder, die zurückgegeben werden sollen
        const { id } = req.params;
        const { fields } = req.query;

        // Fields für die Projektion (nur First-Level-Attribute erlaubt)
    let selectFields = null;
    if (fields) {
      selectFields = fields
        .split(',')
        .map((field) => field.trim())
        .filter((field) => !field.includes('.')) // Nur First-Level-Felder
        .join(' ');
    }

    const digitalIdentity = await DigitalIdentity.findById(id).select(fields);
    if (!digitalIdentity) {
      return res.status(404).json({ message: 'DigitalIdentity not found with the specified criteria' });
    }
      res.json(digitalIdentity);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.patchDigitalIdentity = async (req, res) => {
    try {
      const { id } = req.params;  // ID der DigitalIdentity aus den URL-Parametern
      const updateData = req.body; // Die Daten, die aktualisiert werden sollen

      // Überprüfen, ob die zu aktualisierenden Daten im Body vorhanden sind
      if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({ success: false, message: 'Keine Daten zum Aktualisieren vorhanden' });
      }

      // Finde die DigitalIdentity basierend auf der ID
      const digitalIdentity = await DigitalIdentity.findById(id);

      if (!digitalIdentity) {
        return res.status(404).json({ success: false, message: 'DigitalIdentity nicht gefunden' });
      }

      // Aktualisiere nur die übermittelten Felder
      Object.assign(digitalIdentity, updateData);

      // Speichere das Dokument, damit Pre-save-Hooks ausgeführt werden
      const updatedDigitalIdentity = await digitalIdentity.save();
  
      // Erfolgreiches Update
      res.status(200).json(
        updatedDigitalIdentity
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Serverfehler' });
    }
  };