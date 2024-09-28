const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_4_opt = async (category="Street%20Cabinet") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const url = `http://${actualHost}/resourceInventoryManagement/resource?category=${category}&fields=name,place,relatedParty,resourceCharacteristic`
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    const streetCabinets = accumulatedMetrics.data;

    const streetCabinetsInLeipzig = [];

    // 2. Schritt: Prüfen, ob sich die Street Cabinets in Leipzig befinden
    for (let cabinet of streetCabinets) {
      let resultForCabinet = [];
      const placeHref = `${cabinet.place.href.replace("{host}", actualHost)}?fields=city`  // Href der GeographicAddress-Referenz

      // Abfrage auf die GeographicAddress, um die Stadt zu erhalten -> Beschränkung auf field city, weil nur das notwendig ist
      //accumulatedMetrics = await fetchMetrics(`${placeHref}?fields=city`, accumulatedMetrics);
      accumulatedMetrics = await fetchMetrics(placeHref, accumulatedMetrics);
      const geographicAddress = accumulatedMetrics.data;

      // Prüfen, ob die Stadt "Berlin" ist
      if (geographicAddress.city == "Leipzig") {
        const maintenanceCompany = cabinet.relatedParty.find(party => party.role === 'Wartungsfirma');

        resultForCabinet.push({resource: cabinet, maintenanceCompany: maintenanceCompany, city: geographicAddress.city})
        streetCabinetsInLeipzig.push(cabinet);
      }
    }
    
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
    accumulatedMetrics.data = streetCabinetsInLeipzig;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_4_opt };
