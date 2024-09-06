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

// Mögliche Notizen für das Modem
const noteTexts = [
    "Firmware update applied successfully; system stability improved.",
    "Router rebooted remotely after detecting connectivity issues.",
    "New security patch installed to address WPA3 vulnerability.",
    "Routine maintenance completed; no anomalies detected.",
    "Router configuration updated to improve QoS for video streaming.",
    "Detected high CPU usage; scheduled performance optimization.",
    "Replaced faulty Ethernet port; connectivity restored.",
    "Wi-Fi settings optimized for better coverage in multi-story building.",
    "Backup power system checked; no issues detected.",
    "System logs cleared after reaching storage limit; logs archived."
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

// Funktion zur Generierung von Routers
async function generateRouters(modem, numRouters) {
    try {
      // Suche nach zufälligen GeoAddress-Datensätzen im gleichen Bundesland wie das Central Office
      const place_id = modem.place.id;
      const GeoAdressObj = await GeoAddress.findById(place_id); // get GeoAdressobj of Central Office
      const cityOfModem = GeoAdressObj.city; // take State
      const geoAddresses = await GeoAddress.find({'city': cityOfModem}); //search for all GeoAdress based on state
      //Suche nach einer Organization mit "organizationType": "Wartungsfirma" and "Logistikunternehmen"
      const organization_hersteller = await Organization.findOne({ organizationType: "Gerätehersteller" });
      // const organization_logistik = await Organization.findOne({ organizationType: "Logistikunternehmen" });
  
      if (geoAddresses.length < numRouters) {
        console.log(`Not enough GeoAddresses found in ${cityOfModem} for ${numRouters} routers.`);
        return;
      }
  
      // Generiere Routers
      for (let i = 0; i < numRouters; i++) {
        const geoAddress = getRandomElement(geoAddresses);
  
        const newRouter = new Resource({
          name: `Router for ${modem.name} ${i}`,
          category: "Router",
          resourceCharacteristic: [
            { name: "router_type", "valueType": "String", value: faker.helpers.arrayElement([
                                                                                    "Wired Router",
                                                                                    "Wireless Router",
                                                                                    "Core Router",
                                                                                    "Edge Router",
                                                                                    "Virtual Router",
                                                                                    "VPN Router",
                                                                                    "Mesh Router"
                                                                                  ]) },
            { name: "max_download_speed", value: `${faker.number.float({ min: 1, max: 5 }).toString()}Gbps`, "valueType": "String"},
            { name: "max_upload_speed", value: `${faker.number.int({ min: 50, max: 300 }).toString()}Mbps`, "valueType": "String" },
            { name: "connection_type", value: faker.helpers.arrayElement([
                                                                        "Ethernet",
                                                                        "Fiber",
                                                                        "DSL",
                                                                        "Cable",
                                                                        "4G LTE",
                                                                        "5G NR",
                                                                        "Satellite"
                                                                      ]), "valueType": "String" },
            { name: "ethernet_ports", value: 4, "valueType": "Number" },
            { name: "usb_ports", value: 1 , "valueType": "Number"},
            { name: "coaxial_input", value: true, "valueType": "Boolean" },
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
                                                                      "WPA2, VPN Passthrough, Firewall",
                                                                      "WPA2/WPA3 Mixed Mode, SPI Firewall",
                                                                      "WPA3, AES Encryption, DNS Filtering",
                                                                      "WPA3, VPN, Stateful Firewall",
                                                                      "WPA3-Enterprise, WPA2, MAC Whitelisting",
                                                                      "WPA3, Firewall, IPsec VPN"
                                                                    ]), "valueType": "String" },
            { name: "last_maintenance", value: faker.date.between({ from: '2022-01-01', to: Date.now() }), "valueType": "Date-Time" },
            { name: "processor", value: faker.helpers.arrayElement([
                                                                      "Qualcomm IPQ8074A, 2.2 GHz",
                                                                      "Broadcom BCM4908, 1.8 GHz",
                                                                      "Intel Puma 7, 1.2 GHz",
                                                                      "MediaTek MT7621, 880 MHz",
                                                                      "Broadcom BCM6750, 1.5 GHz",
                                                                      "Intel Atom C3338, 1.5 GHz",
                                                                      "Realtek RTL8197F, 1.1 GHz"
                                                                    ]), "valueType": "String" },
            { name: "memory", value: faker.helpers.arrayElement(["2GB DDR3",
                                                                  "1GB DDR3",
                                                                  "2GB DDR4",
                                                                  "512MB DDR3",
                                                                  "256MB DDR2",
                                                                  "4GB LPDDR4",
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
                id: modem._id,
                href: `https://{host}/resourceInventoryManagement/resource/${modem._id}`,
                category: "Modem",
                name: modem.name
              }
            }
          ]
        });
  
        // Speichere das Router in der Datenbank
        await newRouter.save();
        console.log(`Router for Modem ${modem.name} created.`);
      }
    } catch (error) {
      console.error("Error generating Routers:", error);
    }
  }


// Funktion zur Erstellung von Routers für alle Modems
async function createRoutersForAllModems(amountRouters) {
    try {
      // Suche nach allen Modems in der Resource-Collection
      const modems = await Resource.find({ category: "Modem" });
  
      if (modems.length === 0) {
        console.log("No Modems found.");
        return;
      }
  
      // Generiere Modems für jedes Modem
      for (const modem of modems) {
        await generateRouters(modem, amountRouters);  // 1 Modems pro Modem
      }
  
      mongoose.connection.close();
    } catch (error) {
      console.error("Error fetching Modems:", error);
      mongoose.connection.close();
    }
  }
// Starte die Erstellung von Modems für das Beispiel Modem
createRoutersForAllModems(1);