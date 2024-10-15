// resourceController.js

const Resource = require('../models/ResourceModels/Resource'); // Importiere das Mongoose-Modell
// Alle erlaubten Felder aus dem Mongoose-Schema extrahieren
const allowedFields = Object.keys(Resource.schema.paths).filter(field => !field.startsWith('_')); // Entfernt interne Felder wie _id

// Controller for retrieving List of Resources
exports.getResourceList = async (req, res) => {
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
                message: `Invalid field(s) requested: ${invalidFields.join(', ')}`                });
            }

            // only first-level attribute selection
            selectFields = requestedFields.filter((field) => !field.includes('.')).join(' ');
        }

        // Create the filter object for MongoDB queries
        const filterObj = { ...filters };

        const characteristicsFilter = [];

        for (const key in filters) {
            if (filters.hasOwnProperty(key) && key.includes('.')) {
                const operatorMatch = key.match(/(gt|lt|gte|lte)$/); // Erkennung von Vergleichsoperatoren
                const operator = operatorMatch ? operatorMatch[0] : null;
                const value = filters[key].replace(operator, '');

                // Mapping MongoDB operators
                const mongoOperator = operator === 'gt' ? '$gt'
                    : operator === 'lt' ? '$lt'
                    : operator === 'gte' ? '$gte'
                    : operator === 'lte' ? '$lte'
                    : null;

                // Filter for specific characteristic
                if (mongoOperator) {
                    characteristicsFilter.push({
                        $elemMatch: {
                            name: key.replace(`.${operator}`, ''),
                            value: { [mongoOperator]: parseInt(value, 10) }
                        }
                    });
                } else {
                    characteristicsFilter.push({
                        $elemMatch: {
                            name: key,
                            value: filters[key]
                        }
                    });
                }
              delete filterObj[key];
            }
        }

        // add CharacteristicFilter to FilterObj
        if (characteristicsFilter.length > 0) {
            filterObj['resourceCharacteristic'] = { $all: characteristicsFilter };
        }
        
        // Get X-Total-Count
        const totalCount = await Resource.countDocuments(filterObj);
        
        // fetch data from DB
        const resources = await Resource.find(filterObj)
            .sort({ [sortField]: sortDirection })
            .select(selectFields)
            .skip(skip)
            .limit(limitVal)
        
        // Get X-Result-Count
        const resultCount = resources.length;

        // Header with x-Result-Count and x-Total-Count
        res.set('x-Result-Count', resultCount);
        res.set('x-Total-Count', totalCount);

        if (offset == 0 && limit == 0){
          res.status(200).json(resources)
        } else if (resultCount == 0 ){
          res.status(404).json({message: "No results found"})
        } else  {
          res.status(206).json(resources)
        }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// Controller for creating new Resource
exports.createResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();

        res.status(201).json(resource);
    } catch (err) {
        if (err.name === 'MongoServerError' && err.message === 'Document failed validation') {
            return res.status(400).json({
                message: 'Validation Error: Document failed validation',
            });
        }
        res.status(500).json({ message: err.message });
    }
};

// Controller for retrieving specific Resource
exports.getResourceById = async (req, res) => {
    try {
      const { id } = req.params;
        const {fields} = req.query

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

        const resource = await Resource.findById(id).select(selectFields);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found with the specified criteria' });
        }
        res.status(200).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller for partially Update of Resource
exports.patchResourceById = async (req, res) => {
    try {
      const { id } = req.params;  
      const updateData = req.body;
  
      if (!updateData || Object.keys(updateData).length === 0) {
          return res.status(400).json({ success: false, message: 'No data for PATCH' });
      }
  
      // find Resource by ID
      const resource = await Resource.findById(id);
  
      if (!resource) {
        return res.status(404).json({ success: false, message: 'DigitalIdentity not found.' });
      }
  
      // update Object
      Object.assign(resource, updateData);
  
      // save Object
      const updatedResource = await resource.save();
  
      res.status(200).json(
        updatedResource
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };

// Controller for deleting of specific Resource
exports.deleteResourceById = async (req, res) => {
    try {
      const { id } = req.params;

      // find and delete Resource by ID
      const deletedResource = await Resource.findByIdAndDelete(id);

      if (!deletedResource) {
          return res.status(404).json({ message: `Resource mit ID ${id} nicht gefunden.` });
      }

      res.status(204).json();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};