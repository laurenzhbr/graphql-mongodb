const mongoose = require('mongoose');

// Verbindung zur ersten Datenbank herstellen
const db1 = mongoose.createConnection('mongodb://localhost:27017/resource_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verbindung zur zweiten Datenbank herstellen
const db2 = mongoose.createConnection('mongodb://localhost:27017/resource_inventory_graphql', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = { db1, db2 };