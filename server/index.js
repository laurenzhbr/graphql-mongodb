// Import packages
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const {createDigitalIDTest1} = require('./utils/writeDigitalIdentityTest')
const { createTestGeoAdress1 } = require('./utils/writeGeoAdressTest');
const { createTestResource4 } = require('./utils/writeResourceTest');
const { createTestOrganization } = require('./utils/writeOrganizationTest')
const { createTestResourceSpecification1 } = require('./utils/writeSpecificationTest')
// Import router for REST and GraphQL
const router = require('./routes/router')

const app = express();

// Middleware für JSON-Verarbeitung
app.use(express.json());

// Verbinde dich mit der lokalen MongoDB-Datenbank
db_orig = mongoose.connect('mongodb://localhost:27017/resource_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB for REST connected');

  // Test-Ressourcen erstellen
  // Kommentiere die folgenden Zeilen ein oder aus, um die entsprechenden Ressourcen zu erstellen
  // createTestResource4();
  //createDigitalIDTest1();
  // createTestOrganization();
  //createTestGeoAdress1();
  //createTestResourceSpecification1();


}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// start router
app.use('/', router)

// Starte den Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl-C to terminate...');
});