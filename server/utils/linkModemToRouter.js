const mongoose = require('mongoose');
require('dotenv').config();
const {faker} = require('@faker-js/faker/locale/de');

// MongoDB-Verbindung
mongoose.connect('mongodb://localhost:27017/resource_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Existierende Resource-Collection (mit Modems und anderen Resourcen)
const Resource = require('../models/ResourceModels/Resource');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

// Existierende GeoAddress-Collection
const GeoAddress = require('../models/GeoAdressModels/GeographicAdress');


async function linkRoutersToModems() {
  try {
    // Finde alle Routers, die eine resourceRelationship zum übergeordneten Modem haben
    const routers = await Resource.find({
      category: "Router",
    });

    if (routers.length === 0) {
      console.log("No Routers with linked Modems found.");
      return;
    }

    // Für jedes Router das zugehörige Modem finden und aktualisieren
    for (const router of routers) {
      // Finde die ID des übergeordneten Modems
      const modemRel = router.resourceRelationship.find(
        (rel) => rel.resource.name.includes("Modem") == true
      );

      if (!modemRel || !modemRel.resource.id) {
        console.log(`No valid Modem relationship found for Router ${router.name}`);
        continue;
      }

      const modemId = modemRel.resource.id;

      // Finde das zugehörige Modem in der Datenbank
      const modem = await Resource.findById(modemId);

      if (!modem) {
        console.log(`Modem with ID ${modemId} not found.`);
        continue;
      }

      // Füge die "targets"-Beziehung in das Modem ein
      const routerRelationship = {
        relationshipType: "targets",
        resource: {
          id: router._id,
          href: `https://{host}/resourceInventoryManagement/resource/${router._id}`,
          category: "Router",
          name: router.name
        }
      };

      // Aktualisiere das Modem, indem du die Router-Beziehung hinzufügst
      await Resource.updateOne(
        { _id: modemId },
        { $push: { resourceRelationship: routerRelationship } }
      );

      console.log(`Updated Modem ${modem.name} with linked Router ${router.name}.`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error linking Routers to Modems:", error);
    mongoose.connection.close();
  }
}

// Starte die Verknüpfung der Routers mit den Modems
linkRoutersToModems();
