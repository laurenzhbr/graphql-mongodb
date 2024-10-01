const mongoose = require('mongoose');
require('dotenv').config();
const {faker} = require('@faker-js/faker/locale/de');

const dbName = process.env.DB_NAME || 'resource_inventory';

// MongoDB-Verbindung
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Existierende Resource-Collection (mit Central Offices und anderen Resourcen)
const Resource = require('../models/ResourceModels/Resource');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

// Existierende GeoAddress-Collection
const GeoAddress = require('../models/GeographicAddressModels/GeographicAddress');

// Mögliche Notizen für das Street Cabinet
const noteTexts = [
  "Routine maintenance completed; all connections are stable.",
  "Power backup system test passed; no issues detected.",
  "Fiber upgrade completed; network capacity increased by 20%.",
  "Minor network interruptions detected; cause traced to a faulty connection.",
  "Cooling system inspected; fan replacement scheduled for next week.",
  "Security check completed; no unauthorized access detected.",
  "Firmware update applied successfully; new network optimizations enabled.",
  "Cabinet door lock replaced after malfunction; security restored.",
  "New power backup system installed; generator integrated.",
  "Ventilation system cleaned during maintenance; airflow improved."
];


// Zufällige Auswahl aus einer Liste
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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

// Funktion zur Generierung von Street Cabinets
async function generateStreetCabinets(centralOffice, numCabinets) {
  try {
    // Suche nach zufälligen GeoAddress-Datensätzen im gleichen Bundesland wie das Central Office
    const place_id = centralOffice.place.id;
    const GeoAdressObj = await GeoAddress.findById(place_id); // get GeoAdressobj of Central Office
    const stateOfCenralOffice = GeoAdressObj.stateOrProvince; // take State
    const geoAddresses = await GeoAddress.find({'stateOrProvince': stateOfCenralOffice}); //search for all GeoAdress based on state
    //Suche nach einer Organization mit "organizationType": "Wartungsfirma" and "Logistikunternehmen"
    const organization_wartung = await Organization.findOne({ organizationType: "Wartungsfirma" });
    const organization_logistik = await Organization.findOne({ organizationType: "Logistikunternehmen" });

    // Generiere Street Cabinets
    for (let i = 0; i < numCabinets; i++) {
      const geoAddress = getRandomElement(geoAddresses);

      const newStreetCabinet = new Resource({
        name: `Street Cabinet ${stateOfCenralOffice} ${i}`,
        category: "Street Cabinet",
        resourceCharacteristic: [
          { name: "connected_lines", value: faker.number.int({ min: 1000, max: 60000 }), "valueType": "Number" },
          { name: "cabinet_heigth", value: `${faker.number.float({ min: 0.7, max: 2.0 }).toString()}m`, "valueType": "String" },
          { name: "cabinet_width", value: `${faker.number.float({ min: 0.5, max: 1.5 }).toString()}m`, "valueType": "String" },
          { name: "current_capacity_usage", value: faker.number.int({ min: 1, max: 100 }), "valueType": "Number" },
          { name: "maximum_capacity", value: faker.number.int({ min: 400, max: 1500 }), "valueType": "Number" },
          { name: "network_type", value: faker.helpers.arrayElement(['DSL', 'FTTH','Koaxial']), "valueType": "String"},
          { name: "fiber_ready", value: faker.datatype.boolean(), "valueType": "Boolean" },
          { name: "power_backup", value: faker.datatype.boolean(), "valueType": "Boolean" },
          { name: "security_status", value: faker.helpers.arrayElement(['Guarded', 'Video Surveillance', 'Access Controlled', 'Motion Detectors', 'Remote Monitoring']), "valueType": "String" },
          { name: "last_maintenance", value: faker.date.between({ from: '2022-01-01', to: Date.now() }), "valueType": "Date-Time" }
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
            id: organization_logistik._id,
            name: organization_logistik.name,
            role: organization_logistik.organizationType
          },
          {
            id: organization_wartung._id,
            name: organization_wartung.name,
            role: organization_wartung.organizationType
          }
        ],
        note: generateRandomNotes(),
        place: {
          id: geoAddress._id,
          href: `https://azulastudios.com/geographicAddressManagement/geographicAddress/${geoAddress._id}`
        },
        resourceRelationship: [
          {
            relationshipType: "isTargeted",
            resource: {
              id: centralOffice._id,
              href: `https://azulastudios.com/resourceInventoryManagement/resource/${centralOffice._id}`,
              category: "Central Office",
              name: centralOffice.name
            }
          }
        ]
      });

      // Speichere das Street Cabinet in der Datenbank
      await newStreetCabinet.save();
      console.log(`Street Cabinet for Central Office ${stateOfCenralOffice} created.`);
    }
  } catch (error) {
    console.error("Error generating Street Cabinets:", error);
  }
}

// Funktion zur Erstellung von Street Cabinets für alle Central Offices
async function createStreetCabinetsForAllCentralOffices(amountStreetCabinets) {
    try {
      // Suche nach allen Central Offices in der Resource-Collection
      const centralOffices = await Resource.find({ category: "Central Office" });
  
      if (centralOffices.length === 0) {
        console.log("No Central Offices found.");
        return;
      }
  
      // Generiere Street Cabinets für jedes Central Office
      for (const centralOffice of centralOffices) {
        await generateStreetCabinets(centralOffice, amountStreetCabinets);  // 5 Street Cabinets pro Central Office
      }
  
      mongoose.connection.close();
    } catch (error) {
      console.error("Error fetching Central Offices:", error);
      mongoose.connection.close();
    }
  }
// Starte die Erstellung von Street Cabinets für das Beispiel Central Office
createStreetCabinetsForAllCentralOffices(10);
