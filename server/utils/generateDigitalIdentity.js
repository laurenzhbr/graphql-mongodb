const {faker} = require('@faker-js/faker/locale/de');
const mongoose = require('mongoose');
const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity'); // Dein Mongoose-Schema hier importieren
const Resource = require('../models/ResourceModels/Resource');
const dbName = process.env.DB_NAME || 'resource_inventory';

// MongoDB-Verbindung
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Funktion zur Generierung von DigitalIdentities für Router
async function generateDigitalIdentitiesForRouters() {
  try {
    // Finde alle Router in der Resource-Collection
    const routers = await Resource.find({ category: "Router" });

    if (routers.length === 0) {
      console.log("No Routers found.");
      return;
    }

    // Generiere eine DigitalIdentity für jeden Router
    for (const router of routers) {
      const newDigitalIdentity = new DigitalIdentity({
        nickname: faker.internet.displayName(),  // Generiere einen eindeutigen Nickname basierend auf dem Router-Namen
        // status: faker.helpers.arrayElement(['unknown', 'active', 'suspended', 'archived']),  // Standardstatus für neue Identitäten
        status: faker.helpers.arrayElement(['suspended', 'archived']),  // Standardstatus für neue Identitäten
        resourceIdentified: {
          id: router._id,
          name: router.name
        },
      });

      // Speichere die DigitalIdentity in der Datenbank
      await newDigitalIdentity.save();

      console.log(`Digital Identity for Router ${router.name} created.`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error generating Digital Identities for Routers:", error);
    mongoose.connection.close();
  }
}

// Starte die Erstellung der DigitalIdentities für alle Router
generateDigitalIdentitiesForRouters();
