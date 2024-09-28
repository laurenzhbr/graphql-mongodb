const mongoose = require('mongoose');
require('dotenv').config();
const {faker} = require('@faker-js/faker/locale/de');
const dbName = process.env.DB_NAME || 'resource_inventory';

// MongoDB-Verbindung
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
}).catch((err) => console.log("MongoDB connection error:", err));

// Existierende Resource-Collection (mit Central Offices und anderen Resourcen)
const Resource = require('../models/ResourceModels/Resource');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

// Existierende GeoAddress-Collection
const GeoAddress = require('../models/GeographicAddressModels/GeographicAddress');

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
async function createCentralOffices(amount_of_centralOffices) {
  for (const [state, capital] of Object.entries(capitals)) {
    for (let i=1; i < amount_of_centralOffices; i++){
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
          name: `Central Office ${capital} ${i}`,
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
        });

        // Speichere den neuen CentralOffice-Datensatz
        await newCentralOffice.save();
        console.log(`Central Office for ${capital}, ${state} created.`);
      } catch (error) {
        console.error(`Error creating Central Office for ${capital}, ${state}:`, error);
      }
    }}

  // Schließe die MongoDB-Verbindung nach Abschluss
  mongoose.connection.close();
}

// Starte die Funktion zum Erstellen der CentralOffices
createCentralOffices(3);