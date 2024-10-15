// swagger.js

const swaggerAutogen = require('swagger-autogen')();
const { swaggerResource, swaggerOrganization, swaggerDigitalIdentity, swaggerGeographicAddress } = require('./utils/mongooseToSwagger');


const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

const doc = {
  info: {
    title: 'Meine REST API',
    description: 'Beschreibung der API',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  definitions: {
    Resource: swaggerResource,
    Organization: swaggerOrganization,
    DigitalIdentity: swaggerDigitalIdentity,
    GeographicAddress: swaggerGeographicAddress
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index');
});