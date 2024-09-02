const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  href: {
    type: String,
  },
  isHeadOffice: {
    type: Boolean,
  },
  isLegalEntity: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  organizationType: {
    type: String,
  },
});

//Pre-save Hook to generate href-attribute
OrganizationSchema.pre('save', function(next){
    if (!this.href) {
      this.href = `/partyManagement/organizaton/${this._id}`;
    }
    next();
  })

module.exports = mongoose.model('Organization', OrganizationSchema);
