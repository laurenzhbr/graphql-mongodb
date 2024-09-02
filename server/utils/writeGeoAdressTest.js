const GeoAdress = require('../models/GeoAdressModels/GeographicAdress');

function createTestGeoAdress1() {
    const newGeoAdress = new GeoAdress({
        city: 'Berlin',
        country: 'Germany',
        locality: 'Mitte',
        name: 'Sample Name',
        postcode: '10115',
        stateOrProvince: 'Berlin',
        streetName: 'Unter den Linden',
        streetNr: '10',
        streetNrLast: '20',
        streetNrLastSuffix: 'A',
        streetNrSuffix: 'B',
        streetSuffix: 'Süd',
        streetType: 'Allee'
      });
      
      newGeoAdress.save()
      .then(() => console.log('geoAdress saved!'))
      .catch(err => console.error(err));
}


module.exports = {
    createTestGeoAdress1
};