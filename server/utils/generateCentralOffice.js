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

// Liste der Bundesländer und ihrer Hauptstädte
const capitals = {
  "Baden-Württemberg": "Stuttgart",
  "Bayern": "München",
  "Berlin": "Berlin",
  "Brandenburg": "Potsdam",
  "Bremen": "Bremen",
  "Hamburg": "Hamburg",
  "Hessen": "Wiesbaden",
  "Mecklenburg-Vorpommern": "Schwerin",
  "Niedersachsen": "Hannover",
  "Nordrhein-Westfalen": "Düsseldorf",
  "Rheinland-Pfalz": "Mainz",
  "Saarland": "Saarbrücken",
  "Sachsen": "Dresden",
  "Sachsen-Anhalt": "Magdeburg",
  "Schleswig-Holstein": "Kiel",
  "Thüringen": "Erfurt"
};

// Mögliche Notizen für das Central Office
const noteTexts = [
  "Monthly performance report generated; all systems operating within normal parameters.",
  "Fiber optic cable maintenance completed; no downtime reported.",
  "Routine security audit conducted; minor access control adjustments made.",
  "Capacity planning update: Additional equipment needed to support growing customer base.",
  "Emergency shutdown initiated due to overheating; systems back online after cooling reset.",
  "Intermittent network issues reported; root cause traced to faulty switch.",
  "Power consumption reviewed; efficiency measures to be implemented next quarter.",
  "New backup power system installed and integrated with existing infrastructure.",
  "Incident response drill conducted; all staff completed training successfully.",
  "Expansion plans approved for second data room; construction to begin next month."
];

// Funktion zur Generierung einer zufälligen Anzahl an Notizen (0 bis 10)
function generateRandomNotes() {
  // Zufällige Zahl zwischen 0 und 10, die die Anzahl der Notizen bestimmt
  const noteCount = Math.floor(Math.random() * 11); 

  let notes = [];

  // Füge die entsprechende Anzahl an Notizen hinzu
  for (let i = 0; i < noteCount; i++) {
    const randomText = noteTexts[Math.floor(Math.random() * noteTexts.length)];
    notes.push({
      author: faker.person.fullName(),
      date: faker.date.between({ from: '2023-01-01', to: Date.now() }),  // Aktuelles Datum
      text: randomText  // Zufälliger Text aus der Liste
    });
  }

  return notes;
}

// Funktion, um CentralOffices zu erstellen
async function createCentralOffices() {
  for (const [state, capital] of Object.entries(capitals)) {
    try {
      //Suche nach einer Organization mit "organizationType": "Stromversorger"
      const organization_energy = await Organization.findOne({ organizationType: "Energieversorger" });
      const organization_wartung = await Organization.findOne({ organizationType: "Wartungsfirma" });
      // Suche die GeoAddress der Hauptstadt des Bundeslandes
      const geoAddress = await GeoAddress.findOne({ city: capital });

      if (!geoAddress) {
        console.log(`No GeoAddress found for capital: ${capital} in state: ${state}`);
        continue;
      }

      // Erstelle einen neuen CentralOffice-Datensatz
      const newCentralOffice = new Resource({
        name: `Central Office ${capital}`,
        category: "Central Office",
        resourceCharacteristic: [
          { name: "connected_lines", value: faker.number.int({ min: 1000, max: 60000 }), "valueType": "Number" },
          { name: "building_size", value: `${faker.number.int({ min: 100, max: 500 }).toString()}sqm`, "valueType": "String" },
          { name: "current_capacity_usage", value: `${faker.number.int({ min: 1, max: 100 }).toString()}%`, "valueType": "String" },
          { name: "maximum_capacity", value: faker.number.int({ min: 1000, max: 60000 }), "valueType": "Number" },
          { name: "fiber_backhaul_available", value: faker.datatype.boolean(), "valueType": "Boolean" },
          { name: "power_backup_system", value: faker.helpers.arrayElement(['Diesel Generator', 'USV', 'Solar Backup', 'Brennstoffzellen', 'Hybrid-System']), "valueType": "String"},
          { name: "cooling_system", value: faker.helpers.arrayElement(['HVAC', 'Wärmetauscher', 'Flüssigkeitskühlung']), "valueType": "String"},
        ],
        endOperatingDate: faker.date.future(),
        startOperatingDate: faker.date.between({ from: '2000-01-01', to: Date.now() }),
        version: faker.number.int({ min: 1, max: 5 }).toString(),
        resourceStatus: faker.helpers.arrayElement(['standby', 'alarm', 'available', 'reserved', 'unknown', 'suspended']),
        usageState: faker.helpers.arrayElement(['idle', 'active', 'busy']),
        administrativeState: faker.helpers.arrayElement(['locked', 'unlocked', 'shutdown']),
        operationalState: faker.helpers.arrayElement(['enable', 'disable']),
        relatedParty: [
          {
            id: organization_energy._id,
            name: organization_energy.name,
            role: organization_energy.organizationType
          },
          {
            id: organization_wartung._id,
            name: organization_wartung.name,
            role: organization_wartung.organizationType
          }
        ],
        note: generateRandomNotes(),
        place: {
          id: geoAddress._id
        },
        /* resourceRelationship: [
          {
            relationshipType: "targets",
            resource: {
              id: "9874654",
              href: "https://{host}/resourceInventoryManagement/resource/9874654",
              category: "Street Cabinet",
              name: "Street Cabinet ABC123"
            }
          }
        ] */
      });

      // Speichere den neuen CentralOffice-Datensatz
      await newCentralOffice.save();
      console.log(`Central Office for ${capital}, ${state} created.`);
    } catch (error) {
      console.error(`Error creating Central Office for ${capital}, ${state}:`, error);
    }
  }

  // Schließe die MongoDB-Verbindung nach Abschluss
  mongoose.connection.close();
}

// Starte die Funktion zum Erstellen der CentralOffices
createCentralOffices();





/* // Funktion zur Verknüpfung von Street Cabinets mit Central Offices
async function linkStreetCabinetsToCentralOffice(centralOfficeId) {
  try {
    // Finde alle Street Cabinets, die auf dieses Central Office verweisen
    const streetCabinets = await Resource.find({
      category: "Street Cabinet",
      "resourceRelationship.resource.id": centralOfficeId
    });

    if (streetCabinets.length === 0) {
      console.log(`No Street Cabinets found for Central Office ${centralOfficeId}`);
      return;
    }

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

    console.log(`Updated Central Office ${centralOfficeId} with Street Cabinet relationships.`);
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
linkAllCentralOffices(); */
