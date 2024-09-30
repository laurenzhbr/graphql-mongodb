// Import packages
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');  // Die generierte Swagger-Dokumentation
require('dotenv').config();

// Import router for REST and GraphQL
const router = require('./routes/router')

const { getMemoryUsage, getCpuUsage } = require('./utils/tracing'); // Importiere die Tracing-Funktionen
const dbName = process.env.DB_NAME || 'resource_inventory';
const app = express();

// Middleware für JSON-Verarbeitung
app.use(express.json());

// Verbinde dich mit der lokalen MongoDB-Datenbank
db_orig = mongoose.connect(`mongodb://localhost:27017/${dbName}`).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


// Add middleware to trace CPU and memory usage
app.use((req, res, next) => {
  const memoryUsage = getMemoryUsage();
  const cpuUsage = getCpuUsage();

  // Add CPU and Memory usage to the response headers
  res.set('x-memory-usage', JSON.stringify(memoryUsage.heapUsed));
  res.set('x-cpu-usage', JSON.stringify(cpuUsage.user));

  // Call next middleware or route handler
  next();
});

// start router
app.use('/', router)

// Swagger-Dokumentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


// Starte den Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`running with DB ${dbName}`)
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`GraphiQL available at http://0.0.0.0:${PORT}/graphql`);
  console.log(`Swagger Docs available at http://0.0.0.0:${PORT}/api-docs`);
  console.log('Press Ctrl-C to terminate...');
});