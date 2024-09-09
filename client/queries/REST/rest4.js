const axiosInstance = require('../../utils/interceptors');

const rest_use_case_4 = async (category="Street%20Cabinet") => {
    const transaction_start = Date.now()
    let total_duration = 0;
    const actualHost = process.env.HOST || 'localhost:4000';

    const url = `http://${actualHost}/resourceInventoryManagement/resource?category=${category}&fields=name,place,relatedParty,resourceCharacteristic`
    const res1 = await axiosInstance.get(url);
    total_duration += res1.duration;

    const streetCabinets = res1.data;

    const streetCabinetsInBerlin = [];

    // 2. Schritt: Prüfen, ob sich die Street Cabinets in Leipzig befinden
    for (const cabinet of streetCabinets) {
      const placeHref = cabinet.place.href
        .replace("{host}", actualHost)
        .replace("https", "http");  // Href der GeographicAddress-Referenz

      // Abfrage auf die GeographicAddress, um die Stadt zu erhalten
      const geographicAddressRes = await axiosInstance.get(placeHref);  // Ersetze {host} durch tatsächlichen API-Host
      total_duration += geographicAddressRes.duration;
      const geographicAddress = geographicAddressRes.data;

      // Prüfen, ob die Stadt "Leipzig" ist
      if (geographicAddress.city === 'Berlin') {
        // 3. Schritt: Characteristics und Wartungsfirmen sammeln
        const filteredCharacteristics = cabinet.resourceCharacteristic.filter((characteristic) =>
            ['connected_lines', 'maximum_capacity', 'power_backup'].includes(characteristic.name)
          );
        const maintenanceCompany = cabinet.relatedParty.find(party => party.role === 'Wartungsfirma');
        /* relatedOrganizationHref = maintenanceCompanies.href
        .replace("{host}", actualHost)
        .replace("https", "http");

        const relatedOrganization = await axiosInstance.get(placeHref);
        const contactMediumType = relatedOrganization.data.contactMediumType
 */
        // Speichern der relevanten Informationen für Street Cabinets in Leipzig
        streetCabinetsInBerlin.push({
          name: cabinet.name,
          characteristics: filteredCharacteristics,
          maintenanceCompanies: {
            name: maintenanceCompany.name,
            href: maintenanceCompany.href,
          },
        });
      }
    }
    
    total_transaction_time = Date.now() - transaction_start;

    const measurements = {'request_times': total_duration, 'total_transaction_time': total_transaction_time}
    return measurements
};


module.exports = { rest_use_case_4 };
