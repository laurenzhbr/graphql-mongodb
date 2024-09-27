const mongoose = require('mongoose');

const RelatedPlaceRefOrValueSchema = new mongoose.Schema({
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
RelatedPlaceRefOrValueSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `https://{host}/geographicAddressManagement/geographicAddress/${this.id}`;
    }
    next();
  })

module.exports = mongoose.model('RelatedPlaceRefOrValue', RelatedPlaceRefOrValueSchema);