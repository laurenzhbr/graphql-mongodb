const axiosInstance = require('../../utils/interceptors');


const rest_use_case_7 = async () => {
    const actualHost = process.env.HOST || 'localhost:4000';
    let total_duration = 0;

    // 1. Abfrage aller Modems mit Verbindungstyp "FTTH" und Betriebsstatus "enable"
    const url = `http://${actualHost}/partyManagement/organizations?organizationType=Marketing-%20und%20Vertriebspartner&status=validated&creditRating_gt=750&limit=10&sort=creditRating`;
    const organizationResponse = await axiosInstance.get(url);
    
    // Namen der Organisationen sammeln
    const organizationNames = organizationResponse.data.map(org => org.name);
    return organizationNames;

    if (modems.length === 0) {
        console.log('KEINE Modems gefunden, die ohne Probleme laufen');
    }

    return {'request_times': modemResponse};
};


module.exports = { rest_use_case_7 };
