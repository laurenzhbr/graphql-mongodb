const mongoose = require('mongoose');

const ResourceRefOrValueSchema = new mongoose.Schema({
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
ResourceRefOrValueSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `http://{host}/resourceInventoryManagement/resource${this.id}`;
    }
    next();
  })

module.exports = mongoose.model('ResourceRefOrValue', ResourceRefOrValueSchema);
