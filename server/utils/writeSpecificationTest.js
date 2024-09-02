const ResourceSpecification = require('../ResourceCatalogModels/ResourceSpecification');

function createTestResourceSpecification1() {
    const newResourceSpecification = new ResourceSpecification({
        category: 'Network Equipment',
        description: 'This is a mock description for a resource specification.',
        name: 'Router Specification',
        lifecycleStatus: 'active',
        version: '1.0.0'
    });
      
      newResourceSpecification.save()
      .then(() => console.log('ResourceSpecification saved!'))
      .catch(err => console.error(err));
}


module.exports = {
    createTestResourceSpecification1
};