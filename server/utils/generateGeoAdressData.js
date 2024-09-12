

const {faker} = require('@faker-js/faker/locale/de');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const GeoAdress = require('../models/GeoAdressModels/GeographicAdress')
const xlsx = require('xlsx');


const dbName = process.env.DB_NAME || 'resource_inventory';

// MongoDB-Verbindung
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Relativer Anteil der Bevölkerung pro Bundesland (basierend auf 2023-Daten)
const populationPercentages = {
    "Baden-Württemberg": 13.1,
    "Bayern": 15.7,
    "Berlin": 4.4,
    "Brandenburg": 3.0,
    "Bremen": 0.8,
    "Hamburg": 2.2,
    "Hessen": 7.5,
    "Mecklenburg-Vorpommern": 2.0,
    "Niedersachsen": 9.5,
    "Nordrhein-Westfalen": 21.7,
    "Rheinland-Pfalz": 5.0,
    "Saarland": 1.2,
    "Sachsen": 5.1,
    "Sachsen-Anhalt": 2.7,
    "Schleswig-Holstein": 3.5,
    "Thüringen": 2.6
};
// Gesamtbevölkerung (in Prozent)
const totalPercentage = 100;

// Datenstruktur zum Speichern der Städte nach Bundesland
const stateCityMap = {};

// Initialisiere die Map mit leeren Arrays für jedes Bundesland
for (const state in populationPercentages) {
    stateCityMap[state] = [];
}

let cityData = [];

function readCityDataFromExcel(){
    const excelFilePath = path.join(__dirname, '..', '..', '/mock_data','DE_city_plz_state.xlsx');
    const workbook = xlsx.readFile(excelFilePath);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Verarbeite die Excel-Datei
    data.forEach(row => {
      if (row.City && row.PLZ && row.State) {
        cityData.push({
          city: row.City.trim(),
          postcode: row.PLZ.toString().trim(),
          state: row.State.trim()
        });
      }
    });
  }

// Berechnung der Anzahl der Adressen für jedes Bundesland
function calculateAddressCount(totalAddresses) {
    let addressesPerState = {};
    for (const state in populationPercentages) {
      addressesPerState[state] = Math.round(
        (populationPercentages[state] / totalPercentage) * totalAddresses
      );
    }
    return addressesPerState;
  }

// Finde eine zufällige Stadt aus dem Datensatz basierend auf dem Bundesland
function getCityDataForState(state) {
  const citiesInState = cityData.filter(city => city.state === state);
  return citiesInState[Math.floor(Math.random() * citiesInState.length)];
}


// Berechnung der Anzahl der Adressen für jedes Bundesland
function calculateAddressCount(totalAddresses) {
    let addressesPerState = {};
    for (const state in populationPercentages) {
        addressesPerState[state] = Math.round(
            (populationPercentages[state] / totalPercentage) * totalAddresses
        );
    }
    return addressesPerState;
}

// Generiert eine zufällige Adresse für ein bestimmtes Bundesland
function generateAddress(state) {
  const cityInfo = getCityDataForState(state);

  return {
    city: cityInfo.city,
    country: "DE",
    postcode: cityInfo.postcode,
    stateOrProvince: state,
    streetName: faker.location.street(),
    streetNr: faker.number.int({ min: 1, max: 100 }).toString(),
  };
}

// Generiere Adressen basierend auf der Verteilung und speichere sie in der Datenbank
async function generateAndSaveAddresses(totalAddresses) {
  try {
    const addressesPerState = calculateAddressCount(totalAddresses);
    let allAddresses = [];

    for (const state in addressesPerState) {
      const count = addressesPerState[state];
      for (let i = 0; i < count; i++) {
        const newAddress = new GeoAdress(generateAddress(state));
        console.log(newAddress)
        allAddresses.push(newAddress.save());
      }
    }

    // Alle Adressen in der Datenbank speichern
    await Promise.all(allAddresses);
    console.log(`${totalAddresses} Adressen erfolgreich in MongoDB gespeichert.`);
  } catch (error) {
    console.error("Fehler beim Generieren oder Speichern der Adressen:", error);
  } finally {
    mongoose.connection.close(); // Schließe die MongoDB-Verbindung nach dem Speichern
  }
}

// Hauptfunktion
async function main() {
  readCityDataFromExcel();

  // Anzahl der gewünschten Adressen
  const totalAddresses = 3000; // Hier die Anzahl der Adressen einstellen

  // Generiere und speichere die Adressen
  await generateAndSaveAddresses(totalAddresses);
}

// Starte das Skript
main();