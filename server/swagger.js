// swagger.js

const swaggerAutogen = require('swagger-autogen')();
const { swaggerResource, swaggerOrganization, swaggerDigitalIdentity, swaggerGeographicAddress } = require('./utils/mongooseToSwagger'); // Importiere die Swagger-Definitionen


const outputFile = './swagger_output.json';  // Die generierte Swagger-Dokumentationsdatei
const endpointsFiles = ['./index.js'];  // Die Datei(en), die deine Routen enthalten

const doc = {
  info: {
    title: 'Meine REST API',   // Titel der API
    description: 'Beschreibung der API',  // Beschreibung
  },
  host: 'localhost:3000',   // Host-URL (ggf. später auf den Server ändern)
  schemes: ['http'],   // HTTP oder HTTPS
  definitions: {
    Resource: swaggerResource,
    Organization: swaggerOrganization,
    DigitalIdentity: swaggerDigitalIdentity,
    GeographicAddress: swaggerGeographicAddress
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index');  // Starte deinen Server nach der Generierung der Dokumentation
});