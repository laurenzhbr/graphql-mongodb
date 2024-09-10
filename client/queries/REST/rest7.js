const axiosInstance = require('../../utils/interceptors');


const rest_use_case_7 = async () => {
    const actualHost = process.env.HOST || 'localhost:4000';
    let total_duration = 0;

    // 1. Abfrage aller Modems mit Verbindungstyp "FTTH" und Betriebsstatus "enable"
    const url = `http://${actualHost}/resourceManagement/resources?category=Modem&administrativeState=unlocked&operationalState=enable&resourceStatus=available&fields=category,administrativeState,operationalState,resourceStatus`;
    const modemResponse = await axiosInstance.get(url);
    
    // 2. Überprüfen der Ergebnisse und Rückgabe der Modemdaten
    const modems = modemResponse.data;

    if (modems.length === 0) {
        console.log('KEINE Modems gefunden, die ohne Probleme laufen');
    }

    return {'request_times': modemResponse};
};


module.exports = { rest_use_case_7 };
