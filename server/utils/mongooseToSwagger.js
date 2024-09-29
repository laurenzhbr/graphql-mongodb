const mongooseToSwagger = require('mongoose-to-swagger');
const Resource = require('../models/ResourceModels/Resource');
const Organization = require('../models/PartyModels/Organization');
const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');
const GeographicAddress = require('../models/GeographicAddressModels/GeographicAddress');

// Konvertiere alle Modelle zu Swagger-Definitionen
const swaggerResource = mongooseToSwagger(Resource);
const swaggerOrganization = mongooseToSwagger(Organization);
const swaggerDigitalIdentity = mongooseToSwagger(DigitalIdentity);
const swaggerGeographicAddress = mongooseToSwagger(GeographicAddress);

// Beispiel-Ausgabe der Swagger-Definitionen in der Konsole (optional)
console.log("Resource Swagger Definition: ", swaggerResource);
console.log("Organization Swagger Definition: ", swaggerOrganization);
console.log("DigitalIdentity Swagger Definition: ", swaggerDigitalIdentity);
console.log("GeographicAddress Swagger Definition: ", swaggerGeographicAddress);

// Swagger-Schema-Objekte exportieren, um sie später zu verwenden
module.exports = {
    swaggerResource,
    swaggerOrganization,
    swaggerDigitalIdentity,
    swaggerGeographicAddress
  };