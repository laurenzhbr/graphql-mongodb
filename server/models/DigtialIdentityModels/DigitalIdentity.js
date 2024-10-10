const mongoose = require('mongoose');

// Importiere die referenzierten Schemas (diese müssen separat definiert werden)
const ResourceRefSchema = require('./ResourceRef').schema;

// Definiere das DigitalIdentity-Schema
const DigitalIdentitySchema = new mongoose.Schema({
  href: {
    type: String,
    description: "Hyperlink reference"
  },
  creationDate: {
    type: Date,
    default: Date.now,
    description: "Date and time of the Digital Identity creation (timestamp)"
  },
  lastUpdate: {
    type: Date,
    description: "Date and time of the Digital Identity last update (timestamp)"
  },
  nickname: {
    type: String,
    unique: true,
    description: "Nickname associated to this digital identity"
  },
  status: {
    type: String,
    enum: ['unknown', 'active', 'suspended', 'archived'],
    description: "Current lifecycle status of this digital identity"
  },
  resourceIdentified: {
    type: ResourceRefSchema,
    description: "Resource identified by this digital identity"
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
  }
});

//Pre-save Hook to generate href-attribute
DigitalIdentitySchema.pre('save', function(next){
    const now = Date.now();

    // Setze das creationDate nur, wenn das Dokument neu ist
    if (!this.creationDate) {
        this.creationDate = now;
    }

    // Setze das lastUpdate immer auf den aktuellen Zeitpunkt
    this.lastUpdate = now; 

    if (!this.href) {
      this.href = `https://azulastudios/digitalIdentityManagement/digitalIdentity/${this._id}`;
    }

    if (!this.status) {
      this.status = "unknown";
    }

    next();
  })

const DigitalIdentity = mongoose.model('DigitalIdentity', DigitalIdentitySchema);

module.exports = DigitalIdentity;