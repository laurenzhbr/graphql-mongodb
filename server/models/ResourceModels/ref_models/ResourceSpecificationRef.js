const mongoose = require('mongoose');

const ResourceSpecificationRefSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    href: {
        type: String,
        strict: true,
      },
    name: {
        type: String,
        strict: true,
      },
}, { _id: false });

//Pre-save Hook to generate href-attribute
ResourceSpecificationRefSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `http://{host}/resourceCatalog/resourceSpecification/${this.id}`;
    }
    next();
  })

module.exports = mongoose.model('ResourceSpecificationRef', ResourceSpecificationRefSchema);
