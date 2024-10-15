const Organization = require('../models/PartyModels/Organization');
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(Organization.schema.paths).filter(field => !field.startsWith('_')); // Entfernt interne Felder wie _id

// Controller for retrieving List of Organizations
exports.getOrganizationList = async (req, res) => {
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

        // Create a filter object for MongoDB queries, including comparison operators
        const filterObj = {};

        // Loop through filters and handle comparison operators dynamically
        for (const key in filters) {
          if (filters.hasOwnProperty(key)) {
            if (key.includes(".")){
              const parts = key.split('.');
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
        
        // fetch data from DB
        let organizations = await Organization.find(filterObj)
          .sort({ [sortField]: sortDirection })
          .select(selectFields)
          .skip(skip)
          .limit(limitVal)

        // Get X-Result-Count
        const resultCount = organizations.length;

        // Header with x-Result-Count and x-Total-Count
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

// Controller for creating Organization
exports.createOrganization = async (req, res) => {
    const organization = new Organization(req.body);
    try {
        const newOrganization = await organization.save();
        res.status(201).json(newOrganization);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller for deleting specific Organization
exports.deleteOrganzationById = async (req, res) => {
  try {
      const { id } = req.params;

      // find and delete Organization by ID
      const deletedOrganization = await Organization.findByIdAndDelete(id);

      if (!deletedOrganization) {
          return res.status(404).json({ message: `Organization with ID ${id} not found.` });
      }

      res.status(204).json();
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Controller for retrieving specific Organization
exports.getOrganizationById = async (req, res) => {
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

      const organization = await Organization.findById(id).select(selectFields);
      if (!organization) {
          return res.status(404).json({ message: 'Organization not found with the specified criteria' });
      }
      res.status(200).json(organization);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// Controller for partially Updating Organization
exports.patchOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; 

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: 'No data for PATCH' });
    }

    // find Organization by ID
    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    // update Object
    Object.assign(organization, updateData);

    // save Object
    const updatedOrganization = await organization.save();

    res.status(200).json(
      updatedOrganization
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};