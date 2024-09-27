const Organization = require('../models/PartyModels/Organization');

// Controller-Funktion zum Abrufen aller Ressourcen
exports.getOrganizationList = async (req, res) => {
    try {
        // URL-Query-Parameter
        const { offset = 0, limit = 0, fields, sort = "id", ...filters } = req.query;

        // Offset und Limit für Pagination
        const skip = parseInt(offset, 10);
        const limitVal = parseInt(limit, 10);

        // Setze das Sortierfeld und -richtung inline
        const sortField = sort ? sort.replace('-', '') : 'id'; // Entferne '-' wenn vorhanden
        const sortDirection = sort && sort.startsWith('-') ? -1 : 1; // -1 für absteigend, 1 für aufsteigend

        // Fields für die Projektion (nur First-Level-Attribute erlaubt)
        let selectedFields = null;
        if (fields) {
          selectedFields = fields
            .split(',')
            .map((field) => field.trim())
            .filter((field) => !field.includes('.')) // Nur First-Level-Felder
            .join(' ');
        }
        // Create a filter object for MongoDB queries, including comparison operators
        const filterObj = {};

        // Loop through filters and handle comparison operators dynamically
        for (const key in filters) {
          if (filters.hasOwnProperty(key)) {
            if (key.includes(".")){
              const parts = key.split('.'); // Split the nested field by dot (.)
              const fieldName = parts.slice(0, -1).join('.'); // e.g., "creditRating.ratingScore"
              const operator = parts[parts.length - 1]; // e.g., "gt", "lt"

              // Use ternary operator to handle different MongoDB operators
              filterObj[fieldName] = operator === 'gt' ? { $gt: parseInt(filters[key]) }
                                  : operator === 'lt' ? { $lt: parseInt(filters[key]) }
                                  : operator === 'gte' ? { $gte: parseInt(filters[key]) }
                                  : operator === 'lte' ? { $lte: parseInt(filters[key]) }
                                  : filters[key]
            } else {
              filterObj[key] = filters[key]; // Default to simple field:value pair
            }                       
          }
        }

        // Get X-Total-Count
        const totalCount = await Organization.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        let organizations = await Organization.find(filterObj)
          .sort({ [sortField]: sortDirection })
          .select(selectedFields)
          .skip(skip)
          .limit(limitVal)

        // Get X-Result-Count
        const resultCount = organizations.length;

        // Header mit x-Result-Count und x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        if (offset == 0 && limit == 0){
          res.status(200).json(organizations)
        } else if (resultCount == 0 ){
          res.status(404).json({message: "No results found"})
        } else  {
          res.status(206).json(organizations)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller-Funktion zum Erstellen einer neuen Organisation
exports.createOrganization = async (req, res) => {
    const organization = new Organization(req.body);
    try {
        const newOrganization = await organization.save();
        res.status(201).json(newOrganization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller zum Löschen einer spezifischen Organisation anhand der ID
exports.deleteOrganzationById = async (req, res) => {
  try {
      const { id } = req.params;

      // Suche und lösche die Organization anhand der ID
      const deletedOrganization = await Organization.findByIdAndDelete(id);

      // Falls die Organization nicht gefunden wurde
      if (!deletedOrganization) {
          return res.status(404).json({ message: `Organization with ID ${id} not found.` });
      }

      // Erfolgreich gelöscht
      res.status(204).json();
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Controller-Funktion zum Abrufen einer spezifischen Organisation
exports.getOrganizationById = async (req, res) => {
    try {
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

      const organization = await Organization.findById(id).select(selectFields);
      if (!organization) {
          return res.status(404).json({ message: 'Organization not found with the specified criteria' });
      }
      res.status(200).json(organization);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

exports.patchOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;  // ID der Organisation aus den URL-Parametern
    const updateData = req.body; // Die Daten, die aktualisiert werden sollen

    // Überprüfen, ob die zu aktualisierenden Daten im Body vorhanden sind
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: 'No data for PATCH' });
    }

    // Finde die Organisation basierend auf der ID
    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({ success: false, message: 'DigitalIdentity not found.' });
    }

    // Aktualisiere nur die übermittelten Felder
    Object.assign(organization, updateData);

    // Speichere das Dokument, damit Pre-save-Hooks ausgeführt werden
    const updatedOrganization = await organization.save();

    // Erfolgreiches Update
    res.status(200).json(
      updatedOrganization
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};