const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_4 = async (category="Street%20Cabinet", city="Leipzig") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const url = `http://${actualHost}/resourceInventoryManagement/resource?category=${category}&fields=name,place,relatedParty,resourceCharacteristic`
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    const streetCabinets = accumulatedMetrics.data;

    const streetCabinetsInLeipzig = [];

    // 2. Schritt: Prüfen, ob sich die Street Cabinets in Leipzig befinden
    for (const cabinet of streetCabinets) {
      const placeHref = cabinet.place.href
        .replace("{host}", actualHost)
        .replace("https", "http");  // Href der GeographicAddress-Referenz

      // Abfrage auf die GeographicAddress, um die Stadt zu erhalten
      accumulatedMetrics = await fetchMetrics(placeHref, accumulatedMetrics);
      const geographicAddress = accumulatedMetrics.data;

      // Prüfen, ob die Stadt "Berlin" ist
      if (geographicAddress.city === 'Leipzig') {
        // 3. Schritt: Characteristics und Wartungsfirmen sammeln
        streetCabinetsInLeipzig.push(cabinet);


        ////////////////// underneath for detailed use case
        /* const filteredCharacteristics = cabinet.resourceCharacteristic.filter((characteristic) =>
            ['connected_lines', 'maximum_capacity', 'power_backup'].includes(characteristic.name)
          );
        const maintenanceCompany = cabinet.relatedParty.find(party => party.role === 'Wartungsfirma');
        relatedOrganizationHref = maintenanceCompanies.href
        .replace("{host}", actualHost)
        .replace("https", "http");

        const relatedOrganization = await axiosInstance.get(placeHref);
        const contactMediumType = relatedOrganization.data.contactMediumType

        // Speichern der relevanten Informationen für Street Cabinets in Leipzig
        streetCabinetsInLeipzig.push({
          name: cabinet.name,
          characteristics: filteredCharacteristics,
          maintenanceCompanies: {
            name: maintenanceCompany.name,
            href: maintenanceCompany.href,
          },
        }); */
      }
    }
    
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
    accumulatedMetrics.data = streetCabinetsInLeipzig;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_4 };
