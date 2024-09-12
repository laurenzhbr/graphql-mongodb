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

// Existierende Resource-Collection (mit Central Offices und anderen Resourcen)
const Resource = require('../models/ResourceModels/Resource');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

// Existierende GeoAddress-Collection
const GeoAddress = require('../models/GeoAdressModels/GeographicAdress');


// Funktion zur Verknüpfung von Street Cabinets mit Central Offices
async function linkStreetCabinetsToCentralOffice(centralOfficeId) {
  try {
    // Finde alle Street Cabinets, die auf dieses Central Office verweisen
    const streetCabinets = await Resource.find({
      category: "Street Cabinet",
      "resourceRelationship.resource.id": centralOfficeId
    });

    // Erstelle die "targets"-Verknüpfungen für das Central Office
    const relationships = streetCabinets.map((cabinet) => ({
      relationshipType: "targets",
      resource: {
        id: cabinet._id,
        href: `https://{host}/resourceInventoryManagement/resource/${cabinet._id}`,
        category: "Street Cabinet",
        name: cabinet.name
      }
    }));

    // Füge die Verknüpfungen in das Central Office ein
    await Resource.updateOne(
      { _id: centralOfficeId },
      { $push: { resourceRelationship: { $each: relationships } } }
    );
  } catch (error) {
    console.error("Error linking Street Cabinets to Central Office:", error);
  }
}

// Funktion, um alle Central Offices zu aktualisieren
async function linkAllCentralOffices() {
  try {
    // Finde alle Central Offices
    const centralOffices = await Resource.find({ category: "Central Office" });

    // Aktualisiere jedes Central Office, um die zugehörigen Street Cabinets zu verlinken
    for (const centralOffice of centralOffices) {
      await linkStreetCabinetsToCentralOffice(centralOffice._id);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating Central Offices:", error);
    mongoose.connection.close();
  }
}

// Starte die Verknüpfung der Central Offices mit den Street Cabinets
linkAllCentralOffices(); 
