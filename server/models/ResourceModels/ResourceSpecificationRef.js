const mongoose = require('mongoose');

const ResourceSpecificationRefSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    href: {
        type: String,
    },
    name: {
        type: String
    }
}, { _id: false });

//Pre-save Hook to generate href-attribute
ResourceSpecificationRefSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `https://{host}/resourceCatalog/resourceSpecification/${this.id}`;
    }
    next();
  })

module.exports = mongoose.model('ResourceSpecificationRef', ResourceSpecificationRefSchema);
