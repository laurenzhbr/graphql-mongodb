// Import packages
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
require('dotenv').config();

const {createDigitalIDTest1} = require('./utils/writeDigitalIdentityTest')
const { createTestGeoAdress1 } = require('./utils/writeGeoAdressTest');
const { createTestResource1, createTestResource2, createTestResource3, createTestResource5 } = require('./utils/writeResourceTest');
const { createTestOrganization } = require('./utils/writeOrganizationTest')
const { createTestResourceSpecification1 } = require('./utils/writeSpecificationTest')
// Import router for REST and GraphQL
const router = require('./routes/router')

const app = express();

// Middleware für JSON-Verarbeitung
app.use(express.json());

// Verbinde dich mit der lokalen MongoDB-Datenbank
db_orig = mongoose.connect(`${process.env.DB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');

  // Test-Ressourcen erstellen
  // Kommentiere die folgenden Zeilen ein oder aus, um die entsprechenden Ressourcen zu erstellen
  /* createTestResource1();
  createTestResource2();
  createTestResource3();
  createTestResource5(); */
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