const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_7 = async () => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    // 1. Abfrage aller Modems mit Verbindungstyp "FTTH" und Betriebsstatus "enable"
    const url = `http://${actualHost}/partyManagement/organizations?organizationType=Marketing-%20und%20Vertriebspartner&status=validated&creditRating_gt=750&limit=10&sort=creditRating`;
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
    
    // Namen der Organisationen sammeln
    const organizationNames = accumulatedMetrics.data.map(org => org.name);
    return organizationNames;

    if (modems.length === 0) {
        console.log('KEINE Modems gefunden, die ohne Probleme laufen');
    }
};


module.exports = { rest_use_case_7 };
