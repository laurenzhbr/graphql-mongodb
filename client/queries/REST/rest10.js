const { fetchMetrics } = require('../../utils/prepare_metrics');


const rest_use_case_10 = async (status="supsended") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const digiIdUrl = `http://${actualHost}//digitalIdentityManagement/digitalIdentity?status=${status}&limit=10`
    accumulatedMetrics, supsendedDigiIds = await fetchMetrics(digiIdUrl, accumulatedMetrics);
    
    for (entry in supsendedDigiIds) {
        const id_digiId = entry._id;
        accumulatedMetrics, supsendedDigiIds = await fetchMetrics(`http://${actualHost}//digitalIdentityManagement/digitalIdentity/${id_digiId}`, accumulatedMetrics, "delete");
    }

    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_10 };
