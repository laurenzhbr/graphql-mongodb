const GeoAdress = require('../models/GeoAdressModels/GeographicAdress');

function createTestGeoAdress1() {
    const newGeoAdress = new GeoAdress({
        city: 'Leipzig',
        country: 'Germany',
        locality: 'Schönefeld',
        name: 'Beste leben',
        postcode: '04347',
        stateOrProvince: 'Leipzig',
        streetName: 'Unter den Linden',
        streetNr: '4',
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