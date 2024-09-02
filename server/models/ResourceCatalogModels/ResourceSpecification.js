const mongoose = require('mongoose');

const ResourceSpecificationSchema = new mongoose.Schema({
    href: {
        type: String,
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    name: {
        type: String
    },
    lifecycleStatus: {
        type: String
    },
    version: {
        type: String
    },
});

//Pre-save Hook to generate href-attribute
ResourceSpecificationSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `https://{host}/resourceCatalog/resourceSpecification/${this._id}`;
    }
    next();
  })

module.exports = mongoose.model('ResourceSpecification', ResourceSpecificationSchema);
