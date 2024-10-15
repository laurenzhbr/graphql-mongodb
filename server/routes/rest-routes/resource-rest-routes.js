const express = require('express');
const router = express.Router();
const resourceController = require('../../controller/resourceController')

// GET /resource - Retrieve List of Resources 
router.get('/resource/', resourceController.getResourceList);

// POST /resource - Create new Resource
router.post('/resource/', resourceController.createResource);

// GET /resource/:id - Retrieve specific Resource
router.get('/resource/:id', resourceController.getResourceById);

// PATCH /resource/:id - partialy update specific Resource
router.patch('/resource/:id', resourceController.patchResourceById);

// DELETE /resource/:id - Delete specific Resource
router.delete('/resource/:id', resourceController.deleteResourceById);

module.exports = router;