const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(DigitalIdentity.schema.paths).filter(field => !field.startsWith('_')); // Entfernt interne Felder wie _id


// Controller-Funktion zum Abrufen aller DigitalIdentities
exports.getDigitalIdentities = async (req, res) => {
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
                    message: `Invalid field(s) requested: ${invalidFields.join(', ')}. Allowed fields are: ${allowedFields.join(', ')}`
                });
            }

            // Nur First-Level-Felder auswählen
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
        }

        const filterObj = { ...filters };

        // Get X-Total-Count
        const totalCount = await DigitalIdentity.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        let digitalIdentities = await DigitalIdentity.find(filterObj)
          .sort({ [sortField]: sortDirection })
          .select(selectFields)
          .skip(skip)
          .limit(limitVal)
        
        // Get X-Result-Count
        const resultCount = digitalIdentities.length;

        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);
        
        if (offset == 0 && limit == 0){
          res.status(200).json(digitalIdentities)
        } else if (resultCount == 0 ){
          res.status(404).json({message: "No results found"})
        } else  {
          res.status(206).json(digitalIdentities)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller zum Löschen einer spezifischen DigitalIdentity anhand der ID
exports.deleteDigitalIdentityById = async (req, res) => {
  try {
      const { id } = req.params;

      // Suche und lösche die DigitalIdentity anhand der ID
      const deletedDigitalIdentity = await DigitalIdentity.findByIdAndDelete(id);

      // Falls die DigitalIdentity nicht gefunden wurde
      if (!deletedDigitalIdentity) {
          return res.status(404).json({ message: `DigitalIdentity with ID ${id} not found.` });
      }

      // Erfolgreich gelöscht
      res.status(204).json();
  } catch (error) {
      res.status(500).json({ message: error.message });
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

      const digitalIdentity = await DigitalIdentity.findById(id).select(selectFields);
      if (!digitalIdentity) {
        return res.status(404).json({ message: 'DigitalIdentity not found with the specified criteria' });
      }
      res.status(200).json(digitalIdentity);
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
          return res.status(400).json({ success: false, message: 'No data for PATCH' });
      }

      // Finde die DigitalIdentity basierend auf der ID
      const digitalIdentity = await DigitalIdentity.findById(id);

      if (!digitalIdentity) {
        return res.status(404).json({ success: false, message: 'DigitalIdentity not found.' });
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
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };