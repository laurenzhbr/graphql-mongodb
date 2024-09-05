const ResourceSpecification = require('../models/ResourceCatalogModels/ResourceSpecification');

function createTestResourceSpecification1() {
    const newResourceSpecification1 = new ResourceSpecification({
        category: 'Network Equipment',
        description: 'This is a mock description for a resource specification.',
        name: 'Router Specification',
        lifecycleStatus: 'active',
        version: '1.0.0'
    });

    const newResourceSpecification2 = new ResourceSpecification({
        category: 'Landline Equipment',
        description: 'This is a mock description for a resource specification.',
        name: 'Landline Specification',
        lifecycleStatus: 'active',
        version: '1.0.1'
    });
      
      newResourceSpecification1.save()
      newResourceSpecification2.save()
      .then(() => console.log('ResourceSpecification saved!'))
      .catch(err => console.error(err));
}


module.exports = {
    createTestResourceSpecification1
};