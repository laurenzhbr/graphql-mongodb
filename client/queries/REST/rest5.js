const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_5 = async () => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    // 1. Abfrage aller Modems mit Verbindungstyp "FTTH" und Betriebsstatus "enable"
    const url = `http://${actualHost}/partyManagement/organization?organizationType=Marketing-%20und%20Vertriebspartner&creditRating.ratingScore.gt=750&limit=10&sort=-creditRating.ratingScore`;
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_5 };
