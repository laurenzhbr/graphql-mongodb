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

// Existierende Resource-Collection (mit Street Cabinets und anderen Resourcen)
const Resource = require('../models/ResourceModels/Resource');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

// Existierende GeoAddress-Collection
const GeoAddress = require('../models/GeoAdressModels/GeographicAdress');


async function linkModemsToStreetCabinets() {
  try {
    // Finde alle Modems, die eine resourceRelationship zum übergeordneten Street Cabinet haben
    const modems = await Resource.find({
      category: "Modem",
    });

    if (modems.length === 0) {
      console.log("No Modems with linked Street Cabinets found.");
      return;
    }

    // Für jedes Modem das zugehörige Street Cabinet finden und aktualisieren
    for (const modem of modems) {
      // Finde die ID des übergeordneten Street Cabinets
      const streetCabinetRel = modem.resourceRelationship.find(
        (rel) => rel.resource.name.includes("Street Cabinet") == true
      );

      if (!streetCabinetRel || !streetCabinetRel.resource.id) {
        console.log(`No valid Street Cabinet relationship found for Modem ${modem.name}`);
        continue;
      }

      const streetCabinetId = streetCabinetRel.resource.id;

      // Finde das zugehörige Street Cabinet in der Datenbank
      const streetCabinet = await Resource.findById(streetCabinetId);

      if (!streetCabinet) {
        console.log(`Street Cabinet with ID ${streetCabinetId} not found.`);
        continue;
      }

      // Füge die "targets"-Beziehung in das Street Cabinet ein
      const modemRelationship = {
        relationshipType: "targets",
        resource: {
          id: modem._id,
          href: `https://{host}/resourceInventoryManagement/resource/${modem._id}`,
          category: "Modem",
          name: modem.name
        }
      };

      // Aktualisiere das Street Cabinet, indem du die Modem-Beziehung hinzufügst
      await Resource.updateOne(
        { _id: streetCabinetId },
        { $push: { resourceRelationship: modemRelationship } }
      );

      console.log(`Updated Street Cabinet ${streetCabinet.name} with linked Modem ${modem.name}.`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error linking Modems to Street Cabinets:", error);
    mongoose.connection.close();
  }
}

// Starte die Verknüpfung der Modems mit den Street Cabinets
linkModemsToStreetCabinets();
