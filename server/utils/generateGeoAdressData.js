const {faker} = require('@faker-js/faker/locale/de');
const mongoose = require('mongoose');
const GeoAdressModel = require('../models/GeoAdressModels/GeographicAdress')

// Verbinde dich mit der MongoDB-Datenbank
mongoose.connect('mongodb://localhost:27017/resource_inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const generateAddress = () => {
    const id = new mongoose.Types.ObjectId(); // Erzeuge eine neue MongoDB ObjectID
    let city = faker.location.city();
    let stateOrProvince = faker.location.state({ abbreviated: true });    
    return {
        city: city,
        country: "DE",
        locality: city,
        postcode: faker.location.zipCode('#####', {state: stateOrProvince}),
        stateOrProvince: stateOrProvince,
        streetName: faker.location.street(),
        streetNr: faker.number.int({ min: 1, max: 100 }).toString(),
        href: `https://{host}/geographicAdressManagement/geographicAdress/${id}`
    };
};

// Funktion zum Generieren und Speichern von 1000 Adressen
const generateAndSaveAddresses = async () => {
    const addresses = [];

    for (let i = 0; i < 2000; i++) {
        const newAddress = generateAddress();
        addresses.push(newAddress);
    }

    try {
        // Speichere die generierten Adressen in der MongoDB
        await GeoAdressModel.insertMany(addresses);
        console.log('1000 Adressen erfolgreich in die Datenbank geschrieben');
    } catch (error) {
        console.error('Fehler beim Speichern der Adressen:', error);
    } finally {
        // Schließe die MongoDB-Verbindung
        mongoose.connection.close();
    }
};

// Führe die Generierung und Speicherung der Adressen aus
generateAndSaveAddresses();