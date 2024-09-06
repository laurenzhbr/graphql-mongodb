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

// Mögliche Notizen für das Street Cabinet
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

// Funktion zur Generierung von Modems
async function generateModems(streetCabinet, numModems) {
    try {
      // Suche nach zufälligen GeoAddress-Datensätzen im gleichen Bundesland wie das Central Office
      const place_id = streetCabinet.place.id;
      const GeoAdressObj = await GeoAddress.findById(place_id); // get GeoAdressobj of Central Office
      const cityOfStreetCabinet = GeoAdressObj.city; // take State
      const geoAddresses = await GeoAddress.find({'city': cityOfStreetCabinet}); //search for all GeoAdress based on state
      //Suche nach einer Organization mit "organizationType": "Wartungsfirma" and "Logistikunternehmen"
      const organization_hersteller = await Organization.findOne({ organizationType: "Gerätehersteller" });
      // const organization_logistik = await Organization.findOne({ organizationType: "Logistikunternehmen" });
  
      if (geoAddresses.length < numModems) {
        console.log(`Not enough GeoAddresses found in ${cityOfStreetCabinet} for ${numModems} modems.`);
        return;
      }
  
      // Generiere Modems
      for (let i = 0; i < numModems; i++) {
        const geoAddress = getRandomElement(geoAddresses);
  
        const newModem = new Resource({
          name: `Modem ${cityOfStreetCabinet} ${i}`,
          category: "Modem",
          resourceCharacteristic: [
            { name: "modem_type", value: faker.helpers.arrayElement([
                                                                      "Cable Modem",
                                                                      "DSL Modem",
                                                                      "Fiber Modem",
                                                                      "Satellite Modem",
                                                                      "Fixed Wireless Modem",
                                                                      "LTE Modem",
                                                                      "VDSL Modem"
                                                                    ]), "valueType": "String" },
            { name: "max_download_speed", value: `${faker.number.int({ min: 50, max: 300 }).toString()}Gbps`, "valueType": "String"},
            { name: "max_upload_speed", value: `${faker.number.int({ min: 50, max: 300 }).toString()}Mbps`, "valueType": "String" },
            { name: "connection_type", value: faker.helpers.arrayElement([
                                                                      "DOCSIS 3.1",
                                                                      "DOCSIS 3.0",
                                                                      "ADSL2+",
                                                                      "VDSL2",
                                                                      "FTTH (Fiber to the Home)",
                                                                      "4G LTE",
                                                                      "5G NR"
                                                                    ]), "valueType": "String" },
            { name: "ethernet_ports", value: 4 },
            { name: "usb_ports", value: 1 },
            { name: "coaxial_input", value: true },
            { name: "wifi_capability", value: faker.helpers.arrayElement([
                                                                      "Wi-Fi 5 (802.11ac)",
                                                                      "Wi-Fi 6 (802.11ax)",
                                                                      "Wi-Fi 4 (802.11n)",
                                                                      "Wi-Fi 6E (802.11ax with 6GHz)",
                                                                      "Wi-Fi 3 (802.11g)",
                                                                      "Wi-Fi 2 (802.11b)",
                                                                      "Wi-Fi 7 (802.11be)"
                                                                    ]), "valueType": "String" },
            { name: "power_consumption", value: `${faker.number.int({ min: 8, max: 25 }).toString()}W`, "valueType": "String" },
            { name: "security_features", value: faker.helpers.arrayElement([
                                                                      "WPA3, Firewall, MAC Address Filtering",
                                                                      "WPA2, Firewall, VPN Passthrough",
                                                                      "WPA2/WPA3 Mixed Mode, SPI Firewall",
                                                                      "WPA2, AES Encryption, MAC Address Filtering",
                                                                      "WPA3, DNS Filtering, Parental Controls",
                                                                      "WPA3, IPsec VPN, Stateful Firewall",
                                                                      "WPA2-Enterprise, WPA3-Personal, MAC Whitelisting"
                                                                    ]), "valueType": "String" },
            { name: "last_maintenance", value: faker.date.between({ from: '2022-01-01', to: Date.now() }), "valueType": "Date-Time" },
            { name: "processor", value: faker.helpers.arrayElement([
                                                                      "Broadcom BCM3390, 1.5 GHz",
                                                                      "Intel Puma 7, 1.2 GHz",
                                                                      "Qualcomm Atheros, 1.7 GHz",
                                                                      "Broadcom BCM3384, 1.3 GHz",
                                                                      "MediaTek MT7621, 880 MHz",
                                                                      "Intel Atom C3558, 2.2 GHz",
                                                                      "Realtek RTL8197F, 1.1 GHz"
                                                                    ]), "valueType": "String" },
            { name: "memory", value: faker.helpers.arrayElement(["2GB DDR3",
                                                                      "1GB DDR4",
                                                                      "512MB DDR3",
                                                                      "4GB DDR4",
                                                                      "256MB DDR2",
                                                                      "8GB LPDDR4",
                                                                      "1GB LPDDR3"
                                                                    ]), "valueType": "String" },
            { name: "storage", value: faker.helpers.arrayElement([
                                                                      "128MB Flash Storage",
                                                                      "256MB NAND Flash",
                                                                      "512MB eMMC",
                                                                      "1GB SSD",
                                                                      "64MB NOR Flash",
                                                                      "128GB NVMe SSD",
                                                                      "2GB UFS 2.1"
                                                                    ]), "valueType": "String" }
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
              id: organization_hersteller._id,
              name: organization_hersteller.name,
              role: organization_hersteller.organizationType
            }
          ],
          note: generateRandomNotes(),
          place: {
            id: geoAddress._id,
            href: `https://{host}/geographicAdressManagement/geographicAdress/${geoAddress._id}`
          },
          resourceRelationship: [
            {
              relationshipType: "isTargeted",
              resource: {
                id: streetCabinet._id,
                href: `https://{host}/resourceInventoryManagement/resource/${streetCabinet._id}`,
                category: "Street Cabinet",
                name: streetCabinet.name
              }
            }
          ]
        });
  
        // Speichere das Modem in der Datenbank
        await newModem.save();
        console.log(`Modem for Central Office ${cityOfStreetCabinet} created.`);
      }
    } catch (error) {
      console.error("Error generating Modems:", error);
    }
  }


// Funktion zur Erstellung von Modems für alle Street Cabinets
async function createModemsForAllStreetCabinets(amountModems) {
    try {
      // Suche nach allen Street Cabinets in der Resource-Collection
      const streetCabinets = await Resource.find({ category: "Street Cabinet" });
  
      if (streetCabinets.length === 0) {
        console.log("No Street Cabinets found.");
        return;
      }
  
      // Generiere Street Cabinets für jedes Street Cabinet
      for (const streetCabinet of streetCabinets) {
        await generateModems(streetCabinet, amountModems);  // 5 Street Cabinets pro Street Cabinet
      }
  
      mongoose.connection.close();
    } catch (error) {
      console.error("Error fetching Street Cabinets:", error);
      mongoose.connection.close();
    }
  }
// Starte die Erstellung von Street Cabinets für das Beispiel Street Cabinet
createModemsForAllStreetCabinets(1);