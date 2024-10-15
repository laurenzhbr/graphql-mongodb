const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(DigitalIdentity.schema.paths).filter(field => !field.startsWith('_'));


// Controller for retrieving List of DigitalIdentities
exports.getDigitalIdentities = async (req, res) => {
    try {
        const { offset = 0, limit = 0, fields, sort = "id", ...filters } = req.query;

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
        const totalCount = await DigitalIdentity.countDocuments(filterObj);
        
        // fetch data from DB
        let digitalIdentities = await DigitalIdentity.find(filterObj)
          .sort({ [sortField]: sortDirection })
          .select(selectFields)
          .skip(skip)
          .limit(limitVal)
        
        // Get X-Result-Count
        const resultCount = digitalIdentities.length;

        // Header with x-Result-Count and x-Total-Count
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

// Controller for deleting specific DigitalIdentity
exports.deleteDigitalIdentityById = async (req, res) => {
  try {
      const { id } = req.params;

      // find and delete by ID
      const deletedDigitalIdentity = await DigitalIdentity.findByIdAndDelete(id);

      if (!deletedDigitalIdentity) {
          return res.status(404).json({ message: `DigitalIdentity with ID ${id} not found.` });
      }

      res.status(204).json();
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Controller for creating DigitalIdentity
exports.createDigitalIdentity = async (req, res) => {
    const digitalIdentity = new DigitalIdentity(req.body);

    try {
        const newDigitalIdentity = await digitalIdentity.save();
        res.status(201).json(newDigitalIdentity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller for retrieving specific DigitalIdentity
exports.getDigitalIdentityById = async (req, res) => {
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

      const digitalIdentity = await DigitalIdentity.findById(id).select(selectFields);
      if (!digitalIdentity) {
        return res.status(404).json({ message: 'DigitalIdentity not found with the specified criteria' });
      }
      res.status(200).json(digitalIdentity);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// Controller for partially updating DigitalIdentity
exports.patchDigitalIdentity = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({ success: false, message: 'No data for PATCH' });
      }

      // find DigitalIdentity entity
      const digitalIdentity = await DigitalIdentity.findById(id);

      if (!digitalIdentity) {
        return res.status(404).json({ success: false, message: 'DigitalIdentity not found.' });
      }

      // Update object
      Object.assign(digitalIdentity, updateData);

      // Save object
      const updatedDigitalIdentity = await digitalIdentity.save();
  
      res.status(200).json(
        updatedDigitalIdentity
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };