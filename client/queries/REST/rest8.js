const { fetchMetrics } = require('../../utils/prepare_metrics');



const rest_use_case_8 = async (status="suspended") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const digiIdUrl = `http://${actualHost}/digitalIdentityManagement/digitalIdentity?status=${status}&limit=1`
    accumulatedMetrics = await fetchMetrics(digiIdUrl, accumulatedMetrics);
    
    for (entry of accumulatedMetrics.data) {
        const id_digiId =entry._id;
        accumulatedMetrics = {}
        accumulatedMetrics = await fetchMetrics(`http://${actualHost}/digitalIdentityManagement/digitalIdentity/${id_digiId}`, accumulatedMetrics, "delete");
    }

    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_8 };
