const GeoAddress = require('../models/GeographicAddressModels/GeographicAddress');

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
        const totalCount = await GeoAddress.countDocuments(filterObj);
        
        // Dokumente abfragen anhand der gegebenen Filter und Field-Selections
        const geoAddresses = await GeoAddress.find(filterObj)
            .sort({ [sortField]: sortDirection })
            .select(selectedFields)
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

// Controller-Funktion zum Erstellen einer neuen GeoAdresse
exports.createGeoAddress = async (req, res) => {
    const geographicAddress = new GeoAddress( req.body );

    try {
        const newGeographicAddress = await geographicAddress.save();
        res.status(201).json(newGeographicAddress);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller zum Löschen einer spezifischen DigitalIdentity anhand der ID
exports.deleteGeoAddressById = async (req, res) => {
  try {
      const { id } = req.params;

      // Suche und lösche die DigitalIdentity anhand der ID
      const deletedGeographicAddress = await GeoAddress.findByIdAndDelete(id);

      // Falls die DigitalIdentity nicht gefunden wurde
      if (!deletedGeographicAddress) {
          return res.status(404).json({ message: `GeographicAddress with ID ${id} not found.` });
      }

      // Erfolgreich gelöscht
      res.status(204).json();
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Controller-Funktion zum Abrufen einer spezifischen GeoAdresse
exports.getGeoAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const { fields } = req.query;

        // Auswahl der Felder, die zurückgegeben werden sollen
        let selectedFields = null;
        if (fields) {
          selectedFields = fields
            .split(',')
            .map((field) => field.trim())
            .filter((field) => !field.includes('.')) // Nur First-Level-Felder
            .join(' ');
        }

        const geoAddress = await GeoAddress.findById(id).select(selectedFields);
        if (!geoAddress) {
            return res.status(404).json({ message: 'GeoAddress not found with the specified criteria' });
        }
        res.status(200).json(geoAddress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.patchGeoAddressById = async (req, res) => {
  try {
    const { id } = req.params;  // ID der DigitalIdentity aus den URL-Parametern
    const updateData = req.body; // Die Daten, die aktualisiert werden sollen

    // Überprüfen, ob die zu aktualisierenden Daten im Body vorhanden sind
    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: 'No data for PATCH' });
    }

    // Finde die DigitalIdentity basierend auf der ID
    const geographicAddress = await GeoAddress.findById(id);

    if (!geographicAddress) {
      return res.status(404).json({ success: false, message: 'DigitalIdentity not found.' });
    }

    // Aktualisiere nur die übermittelten Felder
    Object.assign(geographicAddress, updateData);

    // Speichere das Dokument, damit Pre-save-Hooks ausgeführt werden
    const updatedGeographicAddress = await geographicAddress.save();

    // Erfolgreiches Update
    res.status(200).json(
      updatedGeographicAddress
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};