const mongoose = require('mongoose');

// Definiere das DigitalIdentity-Schema
const ResourceRefSchema = new mongoose.Schema({
  id: {
        type: String,
        required: true
    },
  href: String,
  name: String,
}, { _id: false }
);

//Pre-save Hook to generate href-attribute
ResourceRefSchema.pre('save', function(next){
  if (!this.href) {
    this.href = `https://{host}/resourceInventoryManagement/resource/${this.id}`;
  }
  next();
})

const ResourceRef = mongoose.model('ResourceRef', ResourceRefSchema);

module.exports = ResourceRef;